import { useState } from "react"
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { resetPassword } from "../services/authService"

function ResetPassword({ navigation }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Mot de passe", "Email obligatoire")
      return
    }
    try {
      setLoading(true)
      await resetPassword({ email })
      Alert.alert("Mot de passe", "Email de réinitialisation envoyé")
      navigation?.navigate?.("Login")
    } catch (err) {
      Alert.alert("Mot de passe", "Erreur lors de l'envoi")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réinitialiser mot de passe</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Envoi..." : "Envoyer"}</Text>
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

export default ResetPassword