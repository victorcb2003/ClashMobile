import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { confirmMail } from "../services/authService"
import { styles } from "../style/confirmation.style"

function Confirmation({ navigation, route }) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const token = route?.params?.token

    const handleSubmit = async () => {
        if (!token) {
            Alert.alert("Confirmation", "Token manquant")
            return
        }
        if (password !== confirmPassword) {
            Alert.alert("Confirmation", "Les mots de passe doivent être identiques")
            return
        }
        try {
            setLoading(true)
            await confirmMail({ token, password })
            Alert.alert("Confirmation", "Compte confirmé")
            navigation?.navigate?.("Login")
        } catch (err) {
            Alert.alert("Confirmation", "Erreur lors de la confirmation")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmation</Text>
            <TextInput placeholder="Mot de passe" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
            <TextInput placeholder="Confirmer le mot de passe" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
            <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Validation..." : "Confirmer"}</Text>
            </Pressable>
        </View>
    )
}

export default Confirmation