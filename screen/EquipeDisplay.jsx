import { useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { addjoueurEquipe, deleteEquipe, findAllJoueur, infoEquipe, removejoueurEquipe, renameEquipe } from "../services/equipeService"
import { getUser } from "../services/authService"
import {styles} from "../style/equipeDisplay.style"

export default function EquipeDisplay({ navigation, route }) {
  const equipeId = route?.params?.id
  const [equipe, setEquipe] = useState(null)
  const [allJoueurs, setAllJoueurs] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [newName, setNewName] = useState("")
  const [selectedPlayerId, setSelectedPlayerId] = useState(null)

  const load = async () => {
    if (!equipeId) return
    try {
      const [equipeData, joueursData, userData] = await Promise.all([
        infoEquipe({ Equipe_id: equipeId }),
        findAllJoueur(),
        getUser(),
      ])
      setEquipe(equipeData)
      setAllJoueurs(joueursData?.Joueurs || [])
      setCurrentUser(userData?.user?.[0] || null)
      setNewName(equipeData?.nom || "")
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [equipeId])

  const canManage = useMemo(() => {
    if (!equipe || !currentUser) return false
    if (currentUser.type === "Admin") return true
    return currentUser.type === "Selectionneurs" && equipe?.Selectionneur?.id === currentUser?.id
  }, [equipe, currentUser])

  const availablePlayers = useMemo(() => allJoueurs.filter((j) => j.Equipe_id == null), [allJoueurs])

  const handleRename = async () => {
    if (!newName || !canManage) return
    await renameEquipe({ Equipe_id: equipeId, nom: newName })
    await load()
  }

  const handleAddPlayer = async () => {
    if (!selectedPlayerId || !canManage) return
    await addjoueurEquipe({ Equipe_id: equipeId, Joueur_id: selectedPlayerId })
    setSelectedPlayerId(null)
    await load()
  }

  const handleRemovePlayer = async (id) => {
    if (!canManage) return
    await removejoueurEquipe({ Equipe_id: equipeId, Joueur_id: id })
    await load()
  }

  const handleDeleteTeam = async () => {
    if (!canManage) return
    try {
      await deleteEquipe({ Equipe_id: equipeId })
      navigation?.navigate?.("Equipe")
    } catch (e) {
      Alert.alert("Équipe", "Suppression impossible")
    }
  }

  if (!equipe) {
    return (
      <View style={styles.center}><Text>Chargement...</Text></View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{equipe.nom}</Text>
      <Text style={styles.sub}>Sélectionneur: {equipe?.Selectionneur?.prenom} {equipe?.Selectionneur?.nom}</Text>

      {canManage && (
        <View style={styles.card}>
          <Text style={styles.section}>Renommer l'équipe</Text>
          <TextInput value={newName} onChangeText={setNewName} style={styles.input} />
          <Pressable style={styles.btn} onPress={handleRename}><Text style={styles.btnText}>Renommer</Text></Pressable>

          <Text style={[styles.section, { marginTop: 14 }]}>Ajouter un joueur</Text>
          <FlatList
            data={availablePlayers.slice(0, 8)}
            keyExtractor={(item) => String(item.id)}
            horizontal
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSelectedPlayerId(item.id)}
                style={[styles.pill, selectedPlayerId === item.id && styles.pillSelected]}
              >
                <Text>{item.prenom} {item.nom}</Text>
              </Pressable>
            )}
          />
          <Pressable style={[styles.btn, { marginTop: 8 }]} onPress={handleAddPlayer}><Text style={styles.btnText}>Ajouter</Text></Pressable>
        </View>
      )}

      <Text style={styles.section}>Joueurs</Text>
      <FlatList
        data={equipe?.Joueurs || []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.playerRow}>
            <View>
              <Text style={styles.playerName}>{item.prenom} {item.nom}</Text>
              <Text style={styles.playerSub}>ID: {item.id}</Text>
            </View>
            {canManage && (
              <Pressable style={styles.btnDanger} onPress={() => handleRemovePlayer(item.id)}>
                <Text style={styles.btnText}>Retirer</Text>
              </Pressable>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun joueur.</Text>}
      />

      {canManage && (
        <Pressable style={[styles.btnDanger, { marginTop: 10 }]} onPress={handleDeleteTeam}>
          <Text style={styles.btnText}>Supprimer l'équipe</Text>
        </Pressable>
      )}
    </View>
  )
}