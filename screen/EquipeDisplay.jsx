import { useEffect, useMemo, useState } from "react"
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { addjoueurEquipe, deleteEquipe, findAllJoueur, infoEquipe, removejoueurEquipe, renameEquipe } from "../services/equipeService"
import { getUser } from "../services/authService"
import { styles } from "../style/equipe.style"

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

/* function LegacyEquipeDisplayWeb() {

  const [equipe, setEquipe] = useState(null)
  const [user, setUser] = useState(null)
  const [joueurs, setJoueurs] = useState([])
  const [openModalRemove, setOpenModalRemove] = useState(false)
  const [removeJoueur, setRemoveJoueur] = useState(null)
  const [addJoueurId, setAddJoueurId] = useState(null)
  const [openModalAdd, setOpenModalAdd] = useState(null)
  const [openModalRename, setOpenModalRename] = useState(false)
  const [nouveauNom, setNouveauNom] = useState("")
  const [openModalDeleteEquipe, setOpenModalDeleteEquipe] = useState(false)
  const [openModalImage, setOpenModalImage] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const fileInputRef = useRef(null)

  const { id: equipe_id } = useParams()
  const navigate = useNavigate()

  async function handleRemoveJoueur() {
    await removejoueurEquipe({ Equipe_id: equipe_id, Joueur_id: removeJoueur.id })
    setRemoveJoueur(null)
    setOpenModalRemove(false)
    setRefresh(!refresh)
  }

  async function handleAddJoueur() {
    await addjoueurEquipe({ Equipe_id: equipe_id, Joueur_id: addJoueurId })
    setAddJoueurId(null)
    setOpenModalAdd(false)
    setRefresh(!refresh)
  }

  async function handleRename() {
    await renameEquipe({ Equipe_id: equipe_id, nom: nouveauNom })
    setNouveauNom("")
    setOpenModalRename(false)
    setRefresh(!refresh)
  }

  async function handleDeleteEquipe() {
    try {
      await deleteEquipe({ Equipe_id: equipe_id })
      setOpenModalDeleteEquipe(false)
      navigate("/equipe")
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe:", error)
    }
  }

  async function handleImageChange(e) {
    const file = e.target.files[0]
    console.log("a")
    if (!file) return

    try {
      console.log("Fichier sélectionné:", file)
      const formDataImage = new FormData()
      formDataImage.append("image", file)
      await postImage({ id: equipe.id, imageFile: formDataImage })
      setRefresh(!refresh)
      fileInputRef.current.value = null
    } catch (error) {
      console.error("Erreur lors de l'upload:", error)
    }
  }

  useEffect(() => {
    (async () => {
      const user = await getUser()
      console.log(user)
      setUser(user)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const joueurNonTrié = (await findAllJoueur()).Joueurs
      setJoueurs(joueurNonTrié.filter(j => j.Equipe_id == null))
    })()
  }, [refresh])

  useEffect(() => {
    (async () => {
      const equipeData = await infoEquipe({ Equipe_id: equipe_id })
      setEquipe(equipeData)
    })()
  }, [refresh, equipe_id])

  const canManage = user && (user.user[0].type == "Selectionneurs" && equipe?.Selectionneur?.id == user.user[0].id || user.user[0].type == "Admin")

  return (
    <div className="relative w-full min-h-screen">
      <Sidebar />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          IL NE FAUT PAS D IMAGE
          alt="background"
          className="fixed w-full h-full object-cover brightness-70"
        />
      </div>

      <div className="relative z-10 ml-16 p-6">
        <div className="w-full max-w-6xl mx-auto">
          {equipe != null ? (
            <>

              <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div onClick={() => { canManage && setOpenModalImage(true) }}>
                      <Avatar equipe={equipe} size="lg" className="shadow-xl" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white">{equipe.nom}</h1>
                      <p className="text-white/70 text-sm mt-1">
                        Sélectionneur: {equipe.Selectionneur?.prenom} {equipe.Selectionneur?.nom}
                      </p>
                    </div>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setOpenModalRename(true) }}
                        className="rounded-lg px-4 py-2 text-white hover:bg-orange-600 transition flex items-center gap-2"
                      >
                        <FaEdit size={32} />
                      </button>
                      <button
                        onClick={() => { setOpenModalDeleteEquipe(true) }}
                        className="rounded-lg px-4 py-2 text-white hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <FaTrashAlt size={32} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Joueurs ({equipe.Joueurs?.length || 0})</h2>
                  {canManage && (
                    <button
                      onClick={() => { setOpenModalAdd(true) }}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 transition flex items-center gap-2"
                    >
                      <IoMdAdd size={18} /> Ajouter
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {equipe.Joueurs && equipe.Joueurs.length > 0 ? (
                    equipe.Joueurs.map((joueur) => (
                      <div
                        key={joueur.id}
                        className="bg-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/20 transition"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar user={joueur} size="sm" />
                          <div>
                            <p className="text-white font-medium">{joueur.prenom} {joueur.nom}</p>
                            <p className="text-white/60 text-xs">Joueur</p>
                          </div>
                        </div>
                        {canManage && (
                          <button
                            onClick={() => { setRemoveJoueur(joueur); setOpenModalRemove(true) }}
                            className="rounded-lg bg-red-500/70 px-3 py-2 text-white hover:bg-red-600 transition"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-white/70 py-8">
                      Aucun joueur dans cette équipe.
                    </div>
                  )}
                </div>
              </div>

              {removeJoueur != null && (
                <ModalLayout isOpen={openModalRemove} handleModal={() => setOpenModalRemove(!openModalRemove)}>
                  <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <p className="font-semibold text-xl mb-6 flex justify-center">Supprimer un joueur</p>
                    <p className="text-center text-slate-700 mb-6">
                      Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{removeJoueur.prenom} {removeJoueur.nom}</span> de l'équipe <span className="font-semibold">{equipe.nom}</span> ?
                    </p>
                    <div className="flex justify-end gap-4 mt-4">
                      <button onClick={() => { setOpenModalRemove(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">
                        Annuler
                      </button>
                      <button onClick={() => handleRemoveJoueur()} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                        Supprimer
                      </button>
                    </div>
                  </div>
                </ModalLayout>
              )}

              {joueurs != [] && (
                <ModalLayout isOpen={openModalAdd} handleModal={() => setOpenModalAdd(!openModalAdd)}>
                  <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                    <p className="font-semibold text-xl mb-6 flex justify-center">Ajouter un joueur</p>
                    <form onSubmit={(e) => { e.preventDefault(); handleAddJoueur() }} className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-md font-medium">Joueur</label>
                        <select
                          required
                          name="addJoueur"
                          defaultValue=""
                          onChange={(e) => setAddJoueurId(e.target.value)}
                          className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                        >
                          <option value="" disabled>Sélectionner un joueur</option>
                          {joueurs.map(j =>
                            <option value={j.id} key={j.id}>
                              {j.prenom} - {j.nom}
                            </option>
                          )}
                        </select>
                      </div>
                      <div className="flex justify-end gap-4 mt-4">
                        <button type="button" onClick={() => { setOpenModalAdd(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">
                          Annuler
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">
                          Ajouter
                        </button>
                      </div>
                    </form>
                  </div>
                </ModalLayout>
              )}

              <ModalLayout isOpen={openModalRename} handleModal={() => setOpenModalRename(!openModalRename)}>
                <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                  <p className="font-semibold text-xl mb-6 flex justify-center">Renommer l'équipe</p>
                  <form onSubmit={(e) => { e.preventDefault(); handleRename() }} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-md font-medium">Nouveau nom</label>
                      <input
                        type="text"
                        required
                        defaultValue={equipe.nom}
                        onChange={(e) => { setNouveauNom(e.target.value) }}
                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                      />
                    </div>
                    <div className="flex justify-end gap-4 mt-4">
                      <button type="button" onClick={() => { setOpenModalRename(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">
                        Annuler
                      </button>
                      <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">
                        Confirmer
                      </button>
                    </div>
                  </form>
                </div>
              </ModalLayout>

              <ModalLayout isOpen={openModalDeleteEquipe} handleModal={() => setOpenModalDeleteEquipe(!openModalDeleteEquipe)}>
                <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                  <p className="font-semibold text-xl mb-6 flex justify-center text-red-600">Supprimer l'équipe</p>
                  <p className="text-center text-slate-700 mb-6">
                    Êtes-vous sûr de vouloir supprimer définitivement l'équipe <span className="font-semibold">{equipe.nom}</span> ? Cette action est irréversible.
                  </p>
                  <div className="flex justify-end gap-4 mt-4">
                    <button onClick={() => { setOpenModalDeleteEquipe(false) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">
                      Annuler
                    </button>
                    <button onClick={() => handleDeleteEquipe()} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                      Supprimer l'équipe
                    </button>
                  </div>
                </div>
              </ModalLayout>

            </>
          ) : (
            <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg text-center">
              <p className="text-white/70">Équipe introuvable avec cet identifiant.</p>
            </div>
          )}
          <ModalLayout isOpen={openModalImage} handleModal={() => setOpenModalImage(false)}>
            <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
              <p className="font-semibold text-xl mb-6 flex justify-center">Photo de profil</p>

              <div className="flex justify-center mb-6">
                <Avatar equipe={equipe} size="xl" className="shadow-xl" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="w-full cursor-pointer">
                  <div className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 text-center font-medium">
                    {equipe?.img_url ? "Remplacer la photo" : "Ajouter une photo"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      await handleImageChange(e)
                      setOpenModalImage(false)
                    }}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>

                {equipe?.img_url && (
                  <button
                    onClick={async () => {
                      try {
                        await deleteImage({ id: equipe.id })
                        const equi = await getUser()
                        setUser(userData?.user?.[0])
                        setOpenModalImage(false)
                      } catch (error) {
                        console.error("Erreur lors de la suppression:", error)
                      }
                    }}
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-medium"
                  >
                    Supprimer la photo
                  </button>
                )}

                <button
                  onClick={() => setOpenModalImage(false)}
                  className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100 font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </ModalLayout>
        </div>
      </div>
    </div>
  )
}
*/
