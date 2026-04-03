import { useEffect, useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { changePassword, getUser, updateUser } from "../services/authService"
import { equipeMe } from "../services/equipeService"
import { styles } from "../style/profil.style"

function Profil({ navigation }) {
  const [user, setUser] = useState(null)
  const [equipe, setEquipe] = useState(null)
  const [matchs, setMatchs] = useState([])
  const [editing, setEditing] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "" })
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

  const load = async () => {
    try {
      const [u, e] = await Promise.all([getUser(), equipeMe()])
      const current = u?.user?.[0] || null
      setUser(current)
      setMatchs(u?.match || [])
      setEquipe(e?.equipe || null)
      setFormData({
        prenom: current?.prenom || "",
        nom: current?.nom || "",
        email: current?.email || "",
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdateUser = async () => {
    try {
      await updateUser({ id: user.id, ...formData })
      setEditing(false)
      await load()
    } catch (error) {
      Alert.alert("Profil", "Erreur de mise à jour")
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert("Profil", "Les mots de passe ne correspondent pas")
      return
    }
    try {
      await changePassword({ id: user.id, currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      setChangingPwd(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      Alert.alert("Profil", "Mot de passe modifié")
    } catch (error) {
      Alert.alert("Profil", "Erreur lors du changement")
    }
  }

  if (!user) return <View style={styles.center}><Text>Chargement...</Text></View>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.name}>{user.prenom} {user.nom}</Text>
      <Text style={styles.sub}>{user.email}</Text>

      <View style={styles.card}>
        <Text style={styles.section}>Statistiques</Text>
        <Text style={styles.sub}>Matchs joués: {matchs.length}</Text>
        <Text style={styles.sub}>Équipe: {equipe?.nom || "Aucune"}</Text>
        {equipe?.id ? (
          <Pressable style={styles.btn} onPress={() => navigation?.navigate?.("EquipeDisplay", { id: equipe.id })}>
            <Text style={styles.btnText}>Voir mon équipe</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => setEditing((v) => !v)}><Text style={styles.btnText}>Modifier</Text></Pressable>
        <Pressable style={styles.btn} onPress={() => setChangingPwd((v) => !v)}><Text style={styles.btnText}>Mot de passe</Text></Pressable>
      </View>

      {editing && (
        <View style={styles.card}>
          <Text style={styles.section}>Modifier mes infos</Text>
          <TextInput style={styles.input} placeholder="Prénom" value={formData.prenom} onChangeText={(v) => setFormData({ ...formData, prenom: v })} />
          <TextInput style={styles.input} placeholder="Nom" value={formData.nom} onChangeText={(v) => setFormData({ ...formData, nom: v })} />
          <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(v) => setFormData({ ...formData, email: v })} />
          <Pressable style={styles.btn} onPress={handleUpdateUser}><Text style={styles.btnText}>Enregistrer</Text></Pressable>
        </View>
      )}

      {changingPwd && (
        <View style={styles.card}>
          <Text style={styles.section}>Changer le mot de passe</Text>
          <TextInput secureTextEntry style={styles.input} placeholder="Mot de passe actuel" value={passwordData.currentPassword} onChangeText={(v) => setPasswordData({ ...passwordData, currentPassword: v })} />
          <TextInput secureTextEntry style={styles.input} placeholder="Nouveau mot de passe" value={passwordData.newPassword} onChangeText={(v) => setPasswordData({ ...passwordData, newPassword: v })} />
          <TextInput secureTextEntry style={styles.input} placeholder="Confirmer" value={passwordData.confirmPassword} onChangeText={(v) => setPasswordData({ ...passwordData, confirmPassword: v })} />
          <Pressable style={styles.btn} onPress={handleChangePassword}><Text style={styles.btnText}>Confirmer</Text></Pressable>
        </View>
      )}
    </View>
  )
}

export default Profil