import { useEffect, useState } from "react"
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { getUser } from "../services/authService"

function Home({ navigation }) {
  const [user, setUser] = useState(null)
  const [matchs, setMatchs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getUser()
        setUser(data?.user?.[0] || null)
        setMatchs(data?.match || [])
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Pelouse.png")} style={styles.bg} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Accueil</Text>
        <Text style={styles.subtitle}>Bienvenue {user?.prenom || "joueur"}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Matchs récents</Text>
          {matchs.length === 0 ? (
            <Text style={styles.textMuted}>Aucun match.</Text>
          ) : (
            matchs.slice(0, 5).map((m) => (
              <Pressable
                key={m.id}
                style={styles.row}
                onPress={() => navigation?.navigate?.("MatchDisplay", { id: m.id })}
              >
                <Text style={styles.rowTitle}>Match #{m.id}</Text>
                <Text style={styles.textMuted}>{m.lieu || "Lieu à définir"}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.quickRow}>
          <Pressable style={styles.quickBtn} onPress={() => navigation?.navigate?.("Tournois")}>
            <Text style={styles.quickBtnText}>Tournois</Text>
          </Pressable>
          <Pressable style={styles.quickBtn} onPress={() => navigation?.navigate?.("Match")}>
            <Text style={styles.quickBtnText}>Matchs</Text>
          </Pressable>
          <Pressable style={styles.quickBtn} onPress={() => navigation?.navigate?.("Equipe")}>
            <Text style={styles.quickBtnText}>Équipes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  content: { padding: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#d1d5db", marginBottom: 14 },
  card: { backgroundColor: "rgba(17,24,39,0.66)", borderRadius: 10, padding: 12, marginBottom: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  row: { paddingVertical: 8, borderTopColor: "rgba(255,255,255,0.15)", borderTopWidth: 1 },
  rowTitle: { color: "#fff", fontWeight: "600" },
  textMuted: { color: "#cbd5e1" },
  quickRow: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: { flex: 1, backgroundColor: "#166534", paddingVertical: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  quickBtnText: { color: "#fff", fontWeight: "700" },
})

export default Home
