import { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { getMatchById, updateMatch } from '../services/matchService'
import { infoEquipe } from '../services/equipeService'
import { findTournoisById } from '../services/tournoisService'
import { createBut, deleteBut, getButByMatch } from '../services/butService'
import { getUser } from '../services/authService'

export default function MatchDisplay({ route }) {
    const matchId = route?.params?.id
    const [match, setMatch] = useState(null)
    const [equipe1, setEquipe1] = useState(null)
    const [equipe2, setEquipe2] = useState(null)
    const [tournois, setTournois] = useState(null)
    const [buts, setButs] = useState([])
    const [currentUser, setCurrentUser] = useState(null)

    const [minute, setMinute] = useState('')
    const [typeBut, setTypeBut] = useState('0')
    const [joueurId, setJoueurId] = useState('')
    const [editLieu, setEditLieu] = useState('')

    const load = async () => {
        if (!matchId) return
        try {
            const [mRes, bRes, uRes] = await Promise.all([getMatchById(matchId), getButByMatch(matchId), getUser()])
            const m = mRes?.data?.match?.[0]
            setMatch(m)
            setButs(bRes?.buts || [])
            setCurrentUser(uRes?.user?.[0] || null)
            setEditLieu(m?.lieu || '')

            if (m?.Equipe1_id) {
                const [e1, e2] = await Promise.all([
                    infoEquipe({ Equipe_id: m.Equipe1_id }),
                    infoEquipe({ Equipe_id: m.Equipe2_id }),
                ])
                setEquipe1(e1)
                setEquipe2(e2)
            }
            if (m?.Tournois_id) {
                const t = await findTournoisById(m.Tournois_id)
                setTournois(t?.data?.Tournois?.[0] || null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => { load() }, [matchId])

    const canManage = useMemo(() => {
        if (!currentUser || !match) return false
        return currentUser.type === 'Admin' || currentUser.id === match.Organisateur_id
    }, [currentUser, match])

    const allPlayers = useMemo(() => [
        ...(equipe1?.Joueurs || []),
        ...(equipe2?.Joueurs || []),
    ], [equipe1, equipe2])

    const score1 = buts.filter(b => (equipe1?.Joueurs || []).some(j => j.id == b.User_id)).length
    const score2 = buts.filter(b => (equipe2?.Joueurs || []).some(j => j.id == b.User_id)).length

    const getPlayerName = (id) => {
        const p = allPlayers.find(x => x.id == id)
        return p ? `${p.prenom} ${p.nom}` : `Joueur #${id}`
    }

    const addBut = async () => {
        if (!joueurId || minute === '') return
        try {
            const base = new Date(match.date_heure)
            const date = new Date(base.getTime() + Number(minute) * 60000)
            const pad = n => String(n).padStart(2, '0')
            const date_heure = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
            await createBut({ date_heure, User_id: Number(joueurId), Type_But: Number(typeBut), Match_id: matchId })
            setMinute('')
            setJoueurId('')
            await load()
        } catch (e) {
            Alert.alert('Match', "Impossible d'ajouter le but")
        }
    }

    const removeBut = async (id) => {
        await deleteBut(id)
        await load()
    }

    const saveLieu = async () => {
        await updateMatch({ Match_id: matchId, lieu: editLieu })
        await load()
    }

    if (!match) return (
        <View style={s.center}>
            <Text style={{ color: '#fff' }}>Chargement...</Text>
        </View>
    )

    return (
        <ScrollView style={s.container} contentContainerStyle={s.content}>
            {/* Score header */}
            <View style={s.scoreCard}>
                <Text style={s.teamsTitle}>
                    {equipe1?.nom || 'Équipe 1'} <Text style={s.vsText}>vs</Text> {equipe2?.nom || 'Équipe 2'}
                </Text>
                <Text style={s.score}>{score1} - {score2}</Text>
                {tournois?.nom ? <Text style={s.tournoisText}>{tournois.nom}</Text> : null}
            </View>

            {/* Info lieu */}
            <View style={s.infoRow}>
                <View style={s.infoBlock}>
                    <Text style={s.infoLabel}>Lieu</Text>
                    <Text style={s.infoValue}>{match.lieu || 'Non défini'}</Text>
                </View>
                <View style={s.infoBlock}>
                    <Text style={s.infoLabel}>Date</Text>
                    <Text style={s.infoValue}>
                        {match.date_heure ? new Date(match.date_heure).toLocaleString('fr-FR') : 'Non définie'}
                    </Text>
                </View>
            </View>

            {/* Modifier le lieu */}
            {canManage && (
                <View style={s.card}>
                    <Text style={s.section}>Modifier le lieu</Text>
                    <TextInput
                        value={editLieu}
                        onChangeText={setEditLieu}
                        style={s.input}
                        placeholder="Lieu du match..."
                        placeholderTextColor="#9ca3af"
                    />
                    <Pressable style={s.btn} onPress={saveLieu}>
                        <Text style={s.btnText}>Enregistrer</Text>
                    </Pressable>
                </View>
            )}

            {/* Ajouter un but */}
            {canManage && (
                <View style={s.card}>
                    <Text style={s.section}>Ajouter un but</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                            {allPlayers.map(item => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => setJoueurId(String(item.id))}
                                    style={[s.pill, joueurId === String(item.id) && s.pillSelected]}
                                >
                                    <Text style={s.pillText}>{item.prenom}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                    <TextInput
                        placeholder="Minute"
                        placeholderTextColor="#9ca3af"
                        value={minute}
                        onChangeText={setMinute}
                        keyboardType="numeric"
                        style={s.input}
                    />
                    <View style={s.typeRow}>
                        <Pressable style={[s.pill, typeBut === '0' && s.pillSelected]} onPress={() => setTypeBut('0')}>
                            <Text style={s.pillText}>Normal</Text>
                        </Pressable>
                        <Pressable style={[s.pill, typeBut === '1' && s.pillSelected]} onPress={() => setTypeBut('1')}>
                            <Text style={s.pillText}>Penalty</Text>
                        </Pressable>
                    </View>
                    <Pressable style={s.btn} onPress={addBut}>
                        <Text style={s.btnText}>Ajouter</Text>
                    </Pressable>
                </View>
            )}

            {/* Liste des buts */}
            <Text style={s.section}>Buts</Text>
            {buts.length === 0 ? (
                <Text style={s.empty}>Aucun but enregistré.</Text>
            ) : buts.map(item => (
                <View key={item.id} style={s.butRow}>
                    <View style={s.butInfo}>
                        <Text style={s.butName}>{getPlayerName(item.User_id)}</Text>
                        <Text style={s.butSub}>{item.Type_But ? 'Penalty' : 'Normal'}</Text>
                    </View>
                    {canManage && (
                        <Pressable style={s.btnDanger} onPress={() => removeBut(item.id)}>
                            <Text style={s.btnText}>Supprimer</Text>
                        </Pressable>
                    )}
                </View>
            ))}
        </ScrollView>
    )
}

const s = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    scoreCard: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 20,
        alignItems: 'center',
        marginBottom: 12,
    },
    teamsTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    vsText: { color: 'rgba(255,255,255,0.5)', fontWeight: '400' },
    score: { color: '#fff', fontSize: 48, fontWeight: '900', lineHeight: 56 },
    tournoisText: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 4 },

    infoRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    infoBlock: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 12,
    },
    infoLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 4 },
    infoValue: { color: '#fff', fontSize: 13 },

    card: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 14,
        marginBottom: 12,
    },
    section: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        color: '#111',
    },
    btn: {
        backgroundColor: '#166534',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    btnText: { color: '#fff', fontWeight: '700' },
    btnDanger: {
        backgroundColor: '#7f1d1d',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    pill: {
        backgroundColor: '#334155',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
    },
    pillSelected: { backgroundColor: '#166534' },
    pillText: { color: '#fff', fontSize: 12 },
    typeRow: { flexDirection: 'row', marginBottom: 10, gap: 8 },

    butRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 12,
        marginBottom: 8,
    },
    butInfo: { flex: 1 },
    butName: { color: '#fff', fontWeight: '700' },
    butSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
    empty: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingVertical: 16 },
})