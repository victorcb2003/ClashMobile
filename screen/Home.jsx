import { useEffect, useState } from "react"
import { Image, Pressable, ScrollView, Text, View } from "react-native"
import { getUser } from "../services/authService"
import { styles } from "../style/home.style"

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

export default Home
