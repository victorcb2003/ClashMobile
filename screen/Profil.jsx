import { useEffect, useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { changePassword, getUser, updateUser } from "../services/authService"
import { equipeMe } from "../services/equipeService"
import { styles } from "../style/profil.style"
import { useAuth } from '../context/AuthProvider';
import Icon from "react-native-vector-icons/Ionicons";

function Profil({ navigation }) {
  const [user, setUser] = useState(null)
  const [equipe, setEquipe] = useState(null)
  const [matchs, setMatchs] = useState([])
  const [editing, setEditing] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "" })
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const { authLogout } = useAuth()

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

  const handleDisconnect = async () => {
    try {
      const res = await authLogout()
    }
    catch (err) {
      console.error(err)
    }
  }

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

      <View style={styles.card}>
        <Text style={styles.section}>Modifier le profil</Text>

        <Pressable style={styles.optionRow} onPress={() => setEditing((v) => !v)}>
          <Icon name="person-outline" size={20} color="#fff" />
          <Text style={styles.optionText}>Modifier mes informations</Text>
        </Pressable>
        {editing && (
          <View style={styles.card}>
            <Text style={styles.section}>Modifier mes infos</Text>
            <TextInput style={styles.input} placeholder="Prénom" value={formData.prenom} onChangeText={(v) => setFormData({ ...formData, prenom: v })} />
            <TextInput style={styles.input} placeholder="Nom" value={formData.nom} onChangeText={(v) => setFormData({ ...formData, nom: v })} />
            <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(v) => setFormData({ ...formData, email: v })} />
            <Pressable style={styles.btn} onPress={handleUpdateUser}><Text style={styles.btnText}>Enregistrer</Text></Pressable>
          </View>
        )}
        <Pressable style={styles.optionRow} onPress={() => setChangingPwd((v) => !v)}>
          <Icon name="lock-closed-outline" size={20} color="#fff" />
          <Text style={styles.optionText}>Changer le mot de passe</Text>
        </Pressable>
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
      <View style={styles.card}>
        <Pressable style={styles.optionRow} onPress={handleDisconnect}>
          <Icon name="log-out-outline" size={20} color="#F54927" />
          <Text style={[styles.optionText, { color: "#F54927" }]}>
            Se déconnecter
          </Text>
        </Pressable>
      </View>

    </View>
  )
}

export default Profil