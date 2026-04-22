
import { useEffect, useMemo, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { createTournois, getTournaments } from '../services/tournoisService'
import { findByTournoisId } from '../services/matchService'
import { getUser } from '../services/authService'

export default function Tournois() {
  const [all,       setAll]       = useState([])
  const [user,      setUser]      = useState(null)
  const [matches,   setMatches]   = useState({})
  const [creating,  setCreating]  = useState(false)
  const [nom,  setNom]  = useState('')
  const [date, setDate] = useState('')
  const [lieu, setLieu] = useState('')

  const load = async () => {
    try {
      const [u, t] = await Promise.all([getUser(), getTournaments()])
      setUser(u?.user?.[0] || null)
      setAll(t || [])
      await fetchMatches((t || []).slice(0, 6))
    } catch (e) { console.error(e) }
  }

  const fetchMatches = async list => {
    const map = {}
    await Promise.all(list.map(async t => {
      try {
        const res = await findByTournoisId({ id: t.id })
        map[t.id] = res?.data?.matchs || []
      } catch (_) { map[t.id] = [] }
    }))
    setMatches(prev => ({ ...prev, ...map }))
  }

  useEffect(() => { load() }, [])

  const now = new Date()
  const my      = useMemo(() => all.filter(t => t?.Organisateurs?.id === user?.id), [all, user])
  const current = useMemo(() => all.filter(t => t?.Organisateurs?.id !== user?.id && new Date(t.date_debut) <= now), [all, user])
  const future  = useMemo(() => all.filter(t => t?.Organisateurs?.id !== user?.id && new Date(t.date_debut) > now), [all, user])

  const handleCreate = async () => {
    if (!nom || !date || !lieu) { Alert.alert('Tournoi', 'Remplis tous les champs'); return }
    try {
      await createTournois({ nom, date, lieu })
      setNom(''); setDate(''); setLieu(''); setCreating(false); await load()
    } catch { Alert.alert('Tournoi', 'Erreur de création') }
  }

  const isOrganisateur = user?.type === 'Organisateurs' || user?.type === 'Admin'

  const TournamentCard = ({ t }) => {
    const hue = (t.id * 32) % 255
    const tMatches = matches[t.id] || []
    const now2 = new Date()
    const upcoming = tMatches.filter(m => new Date(m.date_heure) > now2).sort((a,b) => new Date(a.date_heure) - new Date(b.date_heure))
    const past     = tMatches.filter(m => new Date(m.date_heure) <= now2).sort((a,b) => new Date(b.date_heure) - new Date(a.date_heure))
    return (
      <View style={[tc.card, { borderColor: `hsl(${hue},50%,40%)`, backgroundColor: `hsla(${hue},15%,12%,0.7)` }]}>
        <Text style={[tc.name, { color: `hsl(${hue},80%,88%)` }]}>{t.nom}</Text>
        <Text style={tc.sub}>
          Début : {t.date_debut ? new Date(t.date_debut).toLocaleDateString('fr-FR') : '—'} · {t.lieu}
        </Text>
        {tMatches.length === 0 ? (
          <Text style={tc.noMatch}>Aucun match enregistré</Text>
        ) : (
          <View style={tc.matchRow}>
            <View style={tc.matchCol}>
              <Text style={tc.colLabel}>À venir ({upcoming.length})</Text>
              {upcoming.slice(0,3).map(m => (
                <Text key={m.id} style={tc.matchChip}>
                  {new Date(m.date_heure).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
                </Text>
              ))}
            </View>
            <View style={tc.matchCol}>
              <Text style={tc.colLabel}>Terminés ({past.length})</Text>
              {past.slice(0,3).map(m => (
                <Text key={m.id} style={tc.matchChip}>
                  {new Date(m.date_heure).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>
    )
  }

  const Section = ({ title, data }) => (
    <View style={{ marginBottom: 8 }}>
      <Text style={s.sectionLabel}>{title}</Text>
      {data.length === 0
        ? <Text style={s.empty}>Aucun</Text>
        : data.map(t => <TournamentCard key={t.id} t={t} />)
      }
    </View>
  )

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      {/* Title + create button */}
      <View style={s.titleRow}>
        <Text style={s.title}>Tournois</Text>
        {isOrganisateur && (
          <Pressable onPress={() => setCreating(v => !v)}>
            <Ionicons name="add-circle" size={32} color="#4ade80" />
          </Pressable>
        )}
      </View>

      {/* Create form */}
      {creating && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Créer un tournoi</Text>
          {[
            ['Nom du tournoi', nom, setNom, 'Nom...', false],
            ['Date de début (YYYY-MM-DD)', date, setDate, '2026-06-01', false],
            ['Lieu', lieu, setLieu, 'Lieu du tournoi...', false],
          ].map(([label, val, setter, ph]) => (
            <View key={label}>
              <Text style={s.inputLabel}>{label}</Text>
              <TextInput
                style={s.input} value={val} onChangeText={setter}
                placeholder={ph} placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
          <View style={s.rowEnd}>
            <Pressable style={s.ghostBtn} onPress={() => setCreating(false)}>
              <Text style={s.ghostText}>Annuler</Text>
            </Pressable>
            <Pressable style={s.greenBtn} onPress={handleCreate}>
              <Text style={s.greenText}>Créer</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Section title="Mes tournois" data={my} />
      <Section title="Tournois en cours" data={current} />
      <Section title="Tournois à venir"  data={future} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  sectionLabel: { color: '#86efac', fontSize: 18, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  empty: { color: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', padding: 16, marginBottom: 14 },
  cardTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 12 },
  inputLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, color: '#111', marginBottom: 12 },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  greenBtn: { backgroundColor: '#15803d', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  greenText: { color: '#fff', fontWeight: '700' },
  ghostBtn: { borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16 },
  ghostText: { color: '#94a3b8' },
})

const tc = StyleSheet.create({
  card: { borderWidth: 2, borderRadius: 16, padding: 14, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  sub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 10 },
  noMatch: { color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' },
  matchRow: { flexDirection: 'row', gap: 12 },
  matchCol: { flex: 1 },
  colLabel: { color: '#fff', fontWeight: '700', fontSize: 12, marginBottom: 4 },
  matchChip: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 },
})
