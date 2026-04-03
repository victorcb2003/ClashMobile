import { useEffect, useState } from "react"
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native"
import { createEquipe, findAllEquipe } from "../services/equipeService"
import { getUser } from "../services/authService"
import { styles } from "../style/equipe.style"

export default function Equipe({ navigation }) {
    const [equipes, setEquipes] = useState([])
    const [nom, setNom] = useState("")
    const [user, setUser] = useState(null)
    const [creating, setCreating] = useState(false)

    const load = async () => {
        try {
            const equipesData = await findAllEquipe()
            setEquipes(equipesData?.equipes || [])
            const userData = await getUser()
            setUser(userData?.user?.[0] || null)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const canCreate = ["Admin", "Selectionneurs"].includes(user?.type)

    const handleCreate = async () => {
        if (!nom) return
        try {
            await createEquipe({ nom })
            setNom("")
            setCreating(false)
            await load()
        } catch (error) {
            Alert.alert("Équipe", "Erreur lors de la création")
            console.error(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Équipes</Text>

            {canCreate && (
                <View style={styles.card}>
                    {creating ? (
                        <>
                            <TextInput placeholder="Nom de l'équipe" value={nom} onChangeText={setNom} style={styles.input} />
                            <View style={styles.rowBtns}>
                                <Pressable style={styles.btnGhost} onPress={() => setCreating(false)}><Text>Annuler</Text></Pressable>
                                <Pressable style={styles.btn} onPress={handleCreate}><Text style={styles.btnText}>Créer</Text></Pressable>
                            </View>
                        </>
                    ) : (
                        <Pressable style={styles.btn} onPress={() => setCreating(true)}><Text style={styles.btnText}>Créer une équipe</Text></Pressable>
                    )}
                </View>
            )}

            <FlatList
                data={equipes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Pressable style={styles.item} onPress={() => navigation?.navigate?.("EquipeDisplay", { id: item.id })}>
                        <Text style={styles.itemTitle}>{item.nom}</Text>
                        <Text style={styles.itemSub}>{item.nb_joueurs || item?.Joueurs?.length || 0} joueur(s)</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Aucune équipe.</Text>}
            />
        </View>
    )
}
