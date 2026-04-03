import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, View } from "react-native"
import { getUser, getVerif, putVerif } from "../services/authService"
import { styles } from "../style/admin.style"

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
                <View style={styles.itemInfo}>
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
