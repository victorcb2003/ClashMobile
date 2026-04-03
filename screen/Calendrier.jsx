import { useEffect, useState } from "react"
import { FlatList, Text, View } from "react-native"
import { getUser } from "../services/authService"
import { styles } from "../style/calendrier.style"

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

export default Calendrier