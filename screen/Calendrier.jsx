import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { getUser } from "../services/authService"

function Calendrier() {
  const [matchs, setMatchs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getUser()
        const sorted = [...(data?.match || [])].sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure))
        setMatchs(sorted)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendrier</Text>
      <FlatList
        data={matchs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Match #{item.id}</Text>
            <Text style={styles.itemSub}>{item.lieu || "Lieu à définir"}</Text>
            <Text style={styles.itemSub}>{item.date_heure ? new Date(item.date_heure).toLocaleString() : "Date à définir"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun match.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { color: "#fff", fontWeight: "700", fontSize: 24, marginBottom: 12 },
  item: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 8 },
  itemTitle: { color: "#fff", fontWeight: "700" },
  itemSub: { color: "#cbd5e1" },
  empty: { color: "#cbd5e1" },
})

export default Calendrier