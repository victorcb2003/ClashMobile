import { useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native"
import { createTournois, getTournaments } from "../services/tournoisService"
import { getUser } from "../services/authService"
import { styles } from "../style/tournois.style"

function Tournois() {
  const [all, setAll] = useState([])
  const [user, setUser] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [nom, setNom] = useState("")
  const [date, setDate] = useState("")
  const [lieu, setLieu] = useState("")

  const load = async () => {
    try {
      const [u, t] = await Promise.all([getUser(), getTournaments()])
      setUser(u?.user?.[0] || null)
      setAll(t || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const now = new Date()
  const my = useMemo(() => all.filter((t) => t?.Organisateurs?.id === user?.id), [all, user])
  const current = useMemo(() => all.filter((t) => t?.Organisateurs?.id !== user?.id && new Date(t.date_debut) <= now), [all, user])
  const future = useMemo(() => all.filter((t) => t?.Organisateurs?.id !== user?.id && new Date(t.date_debut) > now), [all, user])

  const handleCreate = async () => {
    try {
      await createTournois({ nom, date, lieu })
      setNom("")
      setDate("")
      setLieu("")
      setShowCreate(false)
      await load()
    } catch (e) {
      Alert.alert("Tournoi", "Erreur de création")
    }
  }

  const renderTournament = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.nom}</Text>
      <Text style={styles.itemSub}>{item.lieu}</Text>
      <Text style={styles.itemSub}>Début: {item.date_debut ? new Date(item.date_debut).toLocaleDateString() : "-"}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournois</Text>

      <Pressable style={styles.btn} onPress={() => setShowCreate((v) => !v)}>
        <Text style={styles.btnText}>{showCreate ? "Fermer" : "Créer un tournoi"}</Text>
      </Pressable>

      {showCreate && (
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder="Nom" value={nom} onChangeText={setNom} />
          <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <TextInput style={styles.input} placeholder="Lieu" value={lieu} onChangeText={setLieu} />
          <Pressable style={styles.btn} onPress={handleCreate}><Text style={styles.btnText}>Valider</Text></Pressable>
        </View>
      )}

      <Text style={styles.section}>Mes tournois</Text>
      <FlatList data={my} keyExtractor={(item) => `my-${item.id}`} renderItem={renderTournament} ListEmptyComponent={<Text style={styles.empty}>Aucun</Text>} />

      <Text style={styles.section}>En cours</Text>
      <FlatList data={current} keyExtractor={(item) => `cur-${item.id}`} renderItem={renderTournament} ListEmptyComponent={<Text style={styles.empty}>Aucun</Text>} />

      <Text style={styles.section}>À venir</Text>
      <FlatList data={future} keyExtractor={(item) => `fut-${item.id}`} renderItem={renderTournament} ListEmptyComponent={<Text style={styles.empty}>Aucun</Text>} />
    </View>
  )
}

export default Tournois
