import { useState } from "react"
import { useAuth } from "../context/AuthProvider"
import { Alert, Pressable, View, Text, TextInput,Image } from "react-native"
import { styles } from "../style/login.style"

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { authLogin } = useAuth()

    const handleSubmit = async () => {
        try {
            const result = await authLogin({
                email: email,
                password: password,
            })

            if (!result) {
                Alert.alert("Connexion", "Identifiants invalides.")
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                Alert.alert("Connexion", "Identifiants invalides.")
                return
            }

            if (!error?.response) {
                Alert.alert("Connexion", "Impossible de joindre le serveur. Vérifie ta connexion réseau.")
                return
            }

            Alert.alert("Connexion", "Erreur lors de la connexion.")
            console.error(error)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.backgroundLayer}>
                <Image source={require('../assets/Pelouse.png')} style={{ height:'100%',width:"100%" }}/>
            </View>

            <View style={styles.foreground}>
                <View style={styles.card}>
                    <Text style={styles.title}>Connexion</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            placeholder="Email..."
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            placeholder="Mot de passe..."
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}
