import { useEffect, useState } from "react"
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { getUser } from "../services/authService"
import { createMatch } from "../services/matchService"
import { findAllEquipe } from "../services/equipeService"

export default function Match({ navigation }) {
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [equipes, setEquipes] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({
    Equipe1_id: "",
    Equipe2_id: "",
    lieu: "",
    date_heure: "",
  })

  const load = async () => {
    try {
      const [userData, equipesData] = await Promise.all([getUser(), findAllEquipe()])
      setUser(userData?.user?.[0] || null)
      setMatches(userData?.match || [])
      setEquipes(equipesData?.equipes || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => { load() }, [])

  const canCreate = user?.type === "Organisateurs" || user?.type === "Admin"

  const handleCreate = async () => {
    if (!formData.Equipe1_id || !formData.Equipe2_id) {
      Alert.alert("Match", "Sélectionne les deux équipes")
      return
    }
    try {
      await createMatch({
        Equipe1_id: Number(formData.Equipe1_id),
        Equipe2_id: Number(formData.Equipe2_id),
        lieu: formData.lieu,
        date_heure: formData.date_heure,
      })
      setFormData({ Equipe1_id: "", Equipe2_id: "", lieu: "", date_heure: "" })
      setShowCreate(false)
      await load()
    } catch (error) {
      Alert.alert("Match", "Erreur lors de la création")
      console.error(error)
    }
  }

  const teamName = (id) => equipes.find((e) => e.id == id)?.nom || `Équipe #${id}`

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Matchs</Text>

      {canCreate && (
        <View style={s.card}>
          {!showCreate ? (
            <Pressable style={s.btn} onPress={() => setShowCreate(true)}>
              <Text style={s.btnText}>+ Créer un match</Text>
            </Pressable>
          ) : (
            <>
              <Text style={s.section}>Équipe 1</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row" }}>
                  {equipes
                    .filter((e) => String(e.id) !== String(formData.Equipe2_id))
                    .map((item) => (
                      <Pressable
                        key={item.id}
                        style={[s.pill, String(item.id) === String(formData.Equipe1_id) && s.pillSelected]}
                        onPress={() => setFormData({ ...formData, Equipe1_id: String(item.id) })}
                      >
                        <Text style={s.pillText}>{item.nom}</Text>
                      </Pressable>
                    ))}
                </View>
              </ScrollView>

              <Text style={s.section}>Équipe 2</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row" }}>
                  {equipes
                    .filter((e) => String(e.id) !== String(formData.Equipe1_id))
                    .map((item) => (
                      <Pressable
                        key={item.id}
                        style={[s.pill, String(item.id) === String(formData.Equipe2_id) && s.pillSelected]}
                        onPress={() => setFormData({ ...formData, Equipe2_id: String(item.id) })}
                      >
                        <Text style={s.pillText}>{item.nom}</Text>
                      </Pressable>
                    ))}
                </View>
              </ScrollView>

              <TextInput
                style={s.input}
                placeholder="Lieu"
                placeholderTextColor="#9ca3af"
                value={formData.lieu}
                onChangeText={(v) => setFormData({ ...formData, lieu: v })}
              />
              <TextInput
                style={s.input}
                placeholder="Date (YYYY-MM-DD HH:mm:ss)"
                placeholderTextColor="#9ca3af"
                value={formData.date_heure}
                onChangeText={(v) => setFormData({ ...formData, date_heure: v })}
              />
              <View style={s.rowEnd}>
                <Pressable style={s.btnGhost} onPress={() => setShowCreate(false)}>
                  <Text style={s.btnGhostText}>Annuler</Text>
                </Pressable>
                <Pressable style={s.btn} onPress={handleCreate}>
                  <Text style={s.btnText}>Créer</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}

      {matches.length === 0 ? (
        <Text style={s.empty}>Aucun match à afficher.</Text>
      ) : matches.map((item) => (
        <Pressable
          key={item.id}
          style={s.item}
          onPress={() => navigation?.navigate?.("MatchDisplay", { id: item.id })}
        >
          <Text style={s.itemTitle}>
            {teamName(item.Equipe1_id)} vs {teamName(item.Equipe2_id)}
          </Text>
          <Text style={s.itemSub}>{item.lieu || "Lieu à définir"}</Text>
          <Text style={s.itemSub}>
            {item.date_heure
              ? new Date(item.date_heure).toLocaleString("fr-FR")
              : "Date à définir"}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 14 },

  card: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    marginBottom: 14,
  },
  section: { color: 'rgba(255,255,255,0.75)', fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#111',
  },
  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  btn: {
    backgroundColor: '#166534',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnGhostText: { color: '#94a3b8' },
  pill: {
    backgroundColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  pillSelected: { backgroundColor: '#15803d' },
  pillText: { color: '#fff', fontSize: 13 },

  item: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  itemTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  itemSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  empty: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 32 },
})