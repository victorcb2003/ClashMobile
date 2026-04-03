import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { resetPassword } from "../services/authService"
import { styles } from "../style/resetPassword.style"

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

export default ResetPassword