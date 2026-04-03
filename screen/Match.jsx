import { useEffect, useState } from "react"
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native"
import { getUser } from "../services/authService"
import { createMatch } from "../services/matchService"
import { findAllEquipe } from "../services/equipeService"
import { styles } from "../style/match.style"

export default function Match({ navigation }) {
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [equipes, setEquipes] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [formData, setFormData] = useState({ Equipe1_id: "", Equipe2_id: "", lieu: "", date_heure: "" })

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

  useEffect(() => {
    load()
  }, [])

  const canCreate = user?.type === "Organisateurs" || user?.type === "Admin"

  const handleCreate = async () => {
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

  const teamName = (id) => equipes.find((e) => e.id == id)?.nom || `Equipe #${id}`

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchs</Text>

      {canCreate && (
        <View style={styles.card}>
          {!showCreate ? (
            <Pressable style={styles.btn} onPress={() => setShowCreate(true)}><Text style={styles.btnText}>Créer un match</Text></Pressable>
          ) : (
            <>
              <Text style={styles.section}>Équipe 1</Text>
              <FlatList
                horizontal
                data={equipes.filter((e) => String(e.id) !== String(formData.Equipe2_id))}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Pressable style={[styles.pill, String(item.id) === String(formData.Equipe1_id) && styles.pillSelected]} onPress={() => setFormData({ ...formData, Equipe1_id: String(item.id) })}><Text>{item.nom}</Text></Pressable>}
              />
              <Text style={styles.section}>Équipe 2</Text>
              <FlatList
                horizontal
                data={equipes.filter((e) => String(e.id) !== String(formData.Equipe1_id))}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Pressable style={[styles.pill, String(item.id) === String(formData.Equipe2_id) && styles.pillSelected]} onPress={() => setFormData({ ...formData, Equipe2_id: String(item.id) })}><Text>{item.nom}</Text></Pressable>}
              />
              <TextInput style={styles.input} placeholder="Lieu" value={formData.lieu} onChangeText={(v) => setFormData({ ...formData, lieu: v })} />
              <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD HH:mm:ss)" value={formData.date_heure} onChangeText={(v) => setFormData({ ...formData, date_heure: v })} />
              <View style={styles.rowEnd}>
                <Pressable style={styles.btnGhost} onPress={() => setShowCreate(false)}><Text>Annuler</Text></Pressable>
                <Pressable style={styles.btn} onPress={handleCreate}><Text style={styles.btnText}>Créer</Text></Pressable>
              </View>
            </>
          )}
        </View>
      )}

      <FlatList
        data={matches}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => navigation?.navigate?.("MatchDisplay", { id: item.id })}>
            <Text style={styles.itemTitle}>{teamName(item.Equipe1_id)} vs {teamName(item.Equipe2_id)}</Text>
            <Text style={styles.itemSub}>{item.lieu || "Lieu à définir"}</Text>
            <Text style={styles.itemSub}>{item.date_heure ? new Date(item.date_heure).toLocaleString() : "Date à définir"}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}
