import { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import {
  infoEquipe, renameEquipe, deleteEquipe, findAllJoueur,
  removejoueurEquipe, addjoueurEquipe,
  setPendingEquipe, deletePendingEquipe, acceptJoueur, rejectJoueur, quiteEquipe,
  postImage, deleteImage,
} from '../services/equipeService'
import { getUser } from '../services/authService'
import Avatar from '../components/Avatar'

export default function EquipeDisplay({ navigation, route }) {
  const equipeId = route?.params?.id
  const [equipe,      setEquipe]      = useState(null)
  const [allJoueurs,  setAllJoueurs]  = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [newName,     setNewName]     = useState('')
  const [selPlayer,   setSelPlayer]   = useState(null)
  const [loading,     setLoading]     = useState(true)

  const load = async () => {
    if (!equipeId) return
    try {
      setLoading(true)
      const [eq, joueurs, u] = await Promise.all([
        infoEquipe({ Equipe_id: equipeId }),
        findAllJoueur(),
        getUser(),
      ])
      setEquipe(eq)
      setAllJoueurs(joueurs?.Joueurs || [])
      setCurrentUser(u?.user?.[0] || null)
      setNewName(eq?.nom || '')
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [equipeId])

  const canManage = useMemo(() => {
    if (!equipe || !currentUser) return false
    return currentUser.type === 'Admin' ||
      (currentUser.type === 'Selectionneurs' && equipe?.Selectionneur?.id === currentUser.id)
  }, [equipe, currentUser])

  const isJoueur = currentUser?.type === 'Joueurs'
  const isInTeam = isJoueur && equipe?.Joueurs?.some(j => j.id === currentUser.id)
  const isPending = isJoueur && equipe?.Pending?.some(j => j.id === currentUser.id)
  const available = useMemo(() => allJoueurs.filter(j => j.Equipe_id == null), [allJoueurs])

  const confirm = (title, msg, action) =>
    Alert.alert(title, msg, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', style: 'destructive', onPress: action },
    ])

  const handleRename = async () => {
    if (!newName.trim()) return
    await renameEquipe({ Equipe_id: equipeId, nom: newName }); await load()
  }
  const handleDelete = () => confirm(
    "Supprimer l'équipe",
    `Supprimer définitivement "${equipe?.nom}" ?`,
    async () => { await deleteEquipe({ Equipe_id: equipeId }); navigation?.navigate?.('Equipe') }
  )
  const handleRemove = j => confirm(
    'Retirer le joueur',
    `Retirer ${j.prenom} ${j.nom} ?`,
    async () => { await removejoueurEquipe({ Equipe_id: equipeId, Joueur_id: j.id }); await load() }
  )
  const handleAdd = async () => {
    if (!selPlayer) return
    await addjoueurEquipe({ Equipe_id: equipeId, Joueur_id: selPlayer }); setSelPlayer(null); await load()
  }
  const handlePickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
    if (res.canceled || !res.assets?.[0]) return
    const asset = res.assets[0]
    const fd = new FormData()
    fd.append('image', { uri: asset.uri, type: 'image/jpeg', name: 'equipe.jpg' })
    await postImage({ id: equipeId, imageFile: fd }); await load()
  }
  const handleDeleteImage = async () => { await deleteImage(equipeId); await load() }

  if (loading || !equipe) {
    return <View style={s.center}><Text style={{ color: '#fff' }}>Chargement...</Text></View>
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Pressable style={s.back} onPress={() => navigation?.navigate?.('Equipe')}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
        <Text style={s.backText}>Équipes</Text>
      </Pressable>

      <View style={s.headerCard}>
        <Pressable onPress={canManage ? handlePickImage : undefined} style={s.avatarWrap}>
          <Avatar equipe={equipe} size="lg" />
          {canManage && (
            <View style={s.cameraBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          )}
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={s.teamName}>{equipe.nom}</Text>
          <Text style={s.teamSub}>
            Sélectionneur : {equipe.Selectionneur?.prenom} {equipe.Selectionneur?.nom}
          </Text>
        </View>
        {canManage && (
          <Pressable onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#fca5a5" />
          </Pressable>
        )}
      </View>

      {canManage && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Renommer l'équipe</Text>
          <TextInput
            style={s.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Nouveau nom..."
            placeholderTextColor="#9ca3af"
          />
          <View style={s.rowEnd}>
            <Pressable style={s.confirmBtn} onPress={handleRename}>
              <Text style={s.confirmText}>Renommer</Text>
            </Pressable>
          </View>
        </View>
      )}

      {canManage && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Ajouter un joueur</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {available.slice(0, 20).map(j => (
                <Pressable
                  key={j.id}
                  style={[s.pill, selPlayer === j.id && s.pillOn]}
                  onPress={() => setSelPlayer(j.id)}
                >
                  <Text style={s.pillText}>{j.prenom} {j.nom}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <Pressable style={s.confirmBtn} onPress={handleAdd}>
            <Text style={s.confirmText}>Ajouter</Text>
          </Pressable>
        </View>
      )}

      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.sectionTitle}>Joueurs ({equipe.Joueurs?.length || 0})</Text>
          {isJoueur && (
            isInTeam ? (
              <Pressable style={s.dangerBtn} onPress={() => confirm('Quitter', 'Quitter cette équipe ?', async () => { await quiteEquipe(); await load() })}>
                <Ionicons name="log-out-outline" size={15} color="#fff" />
                <Text style={s.dangerText}>Quitter</Text>
              </Pressable>
            ) : isPending ? (
              <Pressable style={s.dangerBtn} onPress={async () => { await deletePendingEquipe(); await load() }}>
                <Text style={s.dangerText}>Annuler la demande</Text>
              </Pressable>
            ) : (
              <Pressable style={s.greenBtn} onPress={async () => { await setPendingEquipe({ Equipe_id: equipe.id }); await load() }}>
                <Text style={s.greenText}>Demande de recrutement</Text>
              </Pressable>
            )
          )}
        </View>

        {equipe.Joueurs?.length === 0 ? (
          <Text style={s.empty}>Aucun joueur dans cette équipe.</Text>
        ) : equipe.Joueurs.map(j => (
          <View key={j.id} style={s.playerRow}>
            <Avatar user={j} size="xs" />
            <View style={s.playerInfo}>
              <Text style={s.playerName}>{j.prenom} {j.nom}</Text>
              <Text style={s.playerRole}>Joueur</Text>
            </View>
            {canManage && (
              <Pressable onPress={() => handleRemove(j)}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </Pressable>
            )}
          </View>
        ))}
      </View>

      {canManage && equipe.Pending?.length > 0 && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>En attente ({equipe.Pending.length})</Text>
          {equipe.Pending.map(j => (
            <View key={j.id} style={s.playerRow}>
              <Avatar user={j} size="xs" />
              <View style={s.playerInfo}>
                <Text style={s.playerName}>{j.prenom} {j.nom}</Text>
              </View>
              <Pressable style={s.greenBtn} onPress={async () => { await acceptJoueur({ Equipe_id: equipeId, User_id: j.id }); await load() }}>
                <Text style={s.greenText}>Accepter</Text>
              </Pressable>
              <Pressable style={[s.dangerBtn, { marginLeft: 6 }]} onPress={async () => { await rejectJoueur({ Equipe_id: equipeId, User_id: j.id }); await load() }}>
                <Text style={s.dangerText}>Rejeter</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {canManage && equipe.img_url && (
        <Pressable style={s.deleteImgBtn} onPress={handleDeleteImage}>
          <Ionicons name="image-outline" size={16} color="#fca5a5" />
          <Text style={{ color: '#fca5a5', marginLeft: 6 }}>Supprimer la photo</Text>
        </Pressable>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  backText: { color: '#fff', fontWeight: '600' },

  headerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    padding: 20, marginBottom: 14,
  },
  avatarWrap: { position: 'relative' },
  cameraBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#16a34a', borderRadius: 10, padding: 4,
  },
  headerInfo: { flex: 1 },
  teamName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  teamSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },

  card: {
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    padding: 16, marginBottom: 14,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, color: '#111', marginBottom: 10 },
  rowEnd: { alignItems: 'flex-end' },
  confirmBtn: { backgroundColor: '#15803d', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  confirmText: { color: '#fff', fontWeight: '700' },
  pill: { backgroundColor: '#334155', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  pillOn: { backgroundColor: '#15803d' },
  pillText: { color: '#fff', fontSize: 12 },

  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  playerInfo: { flex: 1 },
  playerName: { color: '#fff', fontWeight: '600' },
  playerRole: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  empty: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingVertical: 16 },

  dangerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#7f1d1d', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  dangerText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  greenBtn: { backgroundColor: '#14532d', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  greenText: { color: '#4ade80', fontSize: 12, fontWeight: '600' },
  deleteImgBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 },
})