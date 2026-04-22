import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { createEquipe, findAllEquipe } from '../services/equipeService'
import { getUser } from '../services/authService'
import Avatar from '../components/Avatar'

export default function Equipe({ navigation }) {
  const [equipes, setEquipes] = useState([])
  const [user, setUser] = useState(null)
  const [nom, setNom] = useState('')
  const [creating, setCreating] = useState(false)

  const load = async () => {
    try {
      const [equipesData, userData] = await Promise.all([findAllEquipe(), getUser()])
      setEquipes(equipesData?.equipes || [])
      setUser(userData?.user?.[0] || null)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  const canCreate = ['Admin', 'Selectionneurs'].includes(user?.type)

  const handleCreate = async () => {
    if (!nom.trim()) return
    try {
      await createEquipe({ nom })
      setNom(''); setCreating(false); await load()
    } catch (e) { Alert.alert('Équipe', 'Erreur lors de la création') }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.titleRow}>
        <Text style={s.title}>Équipes</Text>
        {canCreate && (
          <Pressable onPress={() => setCreating(v => !v)}>
            <Ionicons name="add-circle" size={32} color="#4ade80" />
          </Pressable>
        )}
      </View>

      {creating && (
        <View style={s.card}>
          <Text style={s.cardLabel}>Nom de l'équipe</Text>
          <TextInput
            style={s.input}
            placeholder="Nom..."
            placeholderTextColor="#9ca3af"
            value={nom}
            onChangeText={setNom}
          />
          <View style={s.rowBtns}>
            <Pressable style={s.cancelBtn} onPress={() => setCreating(false)}>
              <Text style={s.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable style={s.createBtn} onPress={handleCreate}>
              <Text style={s.createText}>Créer</Text>
            </Pressable>
          </View>
        </View>
      )}

      {equipes.length === 0 ? (
        <Text style={s.empty}>Aucune équipe à afficher.</Text>
      ) : equipes.map(eq => (
        <Pressable
          key={eq.id}
          style={s.item}
          onPress={() => navigation?.navigate?.('EquipeDisplay', { id: eq.id })}
        >
          <Avatar equipe={eq} size="sm" />
          <View style={s.itemInfo}>
            <Text style={s.itemName}>{eq.nom}</Text>
            <Text style={s.itemSub}>{eq.nb_joueurs ?? eq?.Joueurs?.length ?? 0} joueur(s)</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.35)" />
        </Pressable>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  card: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 16, marginBottom: 14 },
  cardLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, color: '#111', marginBottom: 12 },
  rowBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { borderWidth: 1, borderColor: '#94a3b8', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  cancelText: { color: '#94a3b8' },
  createBtn: { backgroundColor: '#f97316', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  createText: { color: '#fff', fontWeight: '700' },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontWeight: '600', fontSize: 15 },
  itemSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  empty: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 40 },
})