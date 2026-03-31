import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native"
import { getUser, getVerif, putVerif } from "../services/authService"

export default function Admin() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState("")

  const load = async () => {
    try {
      setLoading(true)
      const userData = await getUser()
      const currentUser = userData?.user?.[0]
      setUser(currentUser)
      if (currentUser?.type === "Admin") {
        const verifData = await getVerif()
        setUsers(verifData?.results || [])
      }
    } catch (err) {
      setError("Impossible de charger les utilisateurs")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggleVerif = async (targetUser) => {
    try {
      const isVerified = Boolean(targetUser?.verif || targetUser?.isVerified || targetUser?.verified)
      await putVerif({ id: targetUser.id, value: !isVerified })
      await load()
    } catch (err) {
      Alert.alert("Admin", "Impossible de mettre à jour la vérification")
      console.error(err)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (user?.type !== "Admin") {
    return (
      <View style={styles.center}>
        <Text>Accès refusé</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/Pelouse.png")} style={styles.bg} />
      <View style={styles.overlay}>
        <Text style={styles.title}>Administration</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FlatList
          data={users}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            const verified = Boolean(item?.verif || item?.isVerified || item?.verified)
            return (
              <View style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item?.prenom} {item?.nom}</Text>
                  <Text style={styles.itemSub}>{item?.email}</Text>
                  <Text style={styles.itemSub}>{item?.Utype || item?.type}</Text>
                </View>
                <Pressable style={styles.btn} onPress={() => handleToggleVerif(item)}>
                  <Text style={styles.btnText}>{verified ? "Retirer" : "Vérifier"}</Text>
                </Pressable>
              </View>
            )
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  overlay: { flex: 1, padding: 16, backgroundColor: "rgba(15,23,42,0.45)" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  error: { color: "#fecaca", marginBottom: 8 },
  item: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 12, marginBottom: 8, alignItems: "center" },
  itemName: { color: "#fff", fontWeight: "700" },
  itemSub: { color: "#d1d5db", fontSize: 12 },
  btn: { backgroundColor: "#166534", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
})
