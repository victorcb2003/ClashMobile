import { useState } from "react"
import {
    Alert,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native"
import { formSignUp } from "../services/authService"
import { styles } from "../style/register.style"

function Register({ navigation }) {
    const [prenom, setPrenom] = useState("")
    const [nom, setNom] = useState("")
    const [email, setEmail] = useState("")
    const [type, setType] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!prenom || !nom || !email || !type) {
            Alert.alert("Inscription", "Merci de remplir tous les champs.")
            return
        }

        setLoading(true)

        try {
            await formSignUp({ prenom, nom, email, type })
            Alert.alert("Inscription", "Inscription réussie. Vérifie ton email.")
            if (navigation?.navigate) {
                navigation.navigate("Login")
            }
        } catch (error) {
            Alert.alert("Inscription", "Erreur lors de l'inscription.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const RoleButton = ({ label, value }) => (
        <Pressable
            onPress={() => setType(value)}
            style={[
                styles.roleButton,
                type === value && styles.roleButtonSelected,
            ]}
        >
            <Text style={styles.roleButtonText}>{label}</Text>
        </Pressable>
    )

    return (
        <View style={styles.container}>
            <View style={styles.backgroundLayer}>
                <Image
                    source={require("../assets/Pelouse.png")}
                    style={styles.backgroundImage}
                />
            </View>

            <View style={styles.foreground}>
                <View style={styles.card}>
                    <Text style={styles.title}>Inscription</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Prénom</Text>
                        <TextInput
                            placeholder="Prénom..."
                            value={prenom}
                            onChangeText={setPrenom}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            placeholder="Nom..."
                            value={nom}
                            onChangeText={setNom}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            placeholder="Email..."
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Rôle</Text>
                        <View style={styles.roleRow}>
                            <RoleButton label="Joueur" value="Joueurs" />
                            <RoleButton label="Sélectionneur" value="Selectionneurs" />
                            <RoleButton label="Organisateur" value="Organisateurs" />
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? "Envoi..." : "S'inscrire"}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Register