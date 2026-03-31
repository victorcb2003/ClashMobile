import { useState } from "react"
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { confirmResetPassword } from "../services/authService"

function ConfirmResetPassword({ navigation, route }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const token = route?.params?.token

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert("Mot de passe", "Token manquant")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Mot de passe", "Les mots de passe doivent être identiques")
      return
    }
    try {
      setLoading(true)
      await confirmResetPassword({ token, password })
      Alert.alert("Mot de passe", "Mot de passe réinitialisé")
      navigation?.navigate?.("Login")
    } catch (err) {
      Alert.alert("Mot de passe", "Erreur lors de la confirmation")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau mot de passe</Text>
      <TextInput placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <TextInput placeholder="Confirmer" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Validation..." : "Confirmer"}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", backgroundColor: "#0f172a" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#166534", borderRadius: 8, padding: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
})

export default ConfirmResetPassword