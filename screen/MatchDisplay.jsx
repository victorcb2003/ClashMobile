import { useEffect, useMemo, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { getMatchById, updateMatch } from '../services/matchService'
import { infoEquipe } from '../services/equipeService'
import { findTournoisById } from '../services/tournoisService'
import { createBut, deleteBut, getButByMatch } from '../services/butService'
import { getUser } from '../services/authService'

export default function MatchDisplay({ route }) {
    const matchId = route?.params?.id
    const [match, setMatch] = useState(null)
    const [equipe1, setEquipe1] = useState(null)
    const [equipe2, setEquipe2] = useState(null)
    const [tournois, setTournois] = useState(null)
    const [buts, setButs] = useState([])
    const [currentUser, setCurrentUser] = useState(null)

    const [minute, setMinute] = useState('')
    const [typeBut, setTypeBut] = useState('0')
    const [joueurId, setJoueurId] = useState('')
    const [editLieu, setEditLieu] = useState('')

    const load = async () => {
        if (!matchId) return
        try {
            const [mRes, bRes, uRes] = await Promise.all([getMatchById(matchId), getButByMatch(matchId), getUser()])
            const m = mRes?.data?.match?.[0]
            setMatch(m)
            setButs(bRes?.buts || [])
            setCurrentUser(uRes?.user?.[0] || null)
            setEditLieu(m?.lieu || '')

            if (m?.Equipe1_id) {
                const [e1, e2] = await Promise.all([
                    infoEquipe({ Equipe_id: m.Equipe1_id }),
                    infoEquipe({ Equipe_id: m.Equipe2_id }),
                ])
                setEquipe1(e1)
                setEquipe2(e2)
            }
            if (m?.Tournois_id) {
                const t = await findTournoisById(m.Tournois_id)
                setTournois(t?.data?.Tournois?.[0] || null)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        load()
    }, [matchId])

    const canManage = useMemo(() => {
        if (!currentUser || !match) return false
        return currentUser.type === 'Admin' || currentUser.id === match.Organisateur_id
    }, [currentUser, match])

    const allPlayers = useMemo(() => [
        ...(equipe1?.Joueurs || []),
        ...(equipe2?.Joueurs || []),
    ], [equipe1, equipe2])

    const score1 = buts.filter((b) => (equipe1?.Joueurs || []).some((j) => j.id == b.User_id)).length
    const score2 = buts.filter((b) => (equipe2?.Joueurs || []).some((j) => j.id == b.User_id)).length

    const getPlayerName = (id) => {
        const p = allPlayers.find((x) => x.id == id)
        return p ? `${p.prenom} ${p.nom}` : `Joueur #${id}`
    }

    const addBut = async () => {
        if (!joueurId || minute === '') return
        try {
            const base = new Date(match.date_heure)
            const date = new Date(base.getTime() + Number(minute) * 60000)
            const date_heure = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
            await createBut({ date_heure, User_id: Number(joueurId), Type_But: Number(typeBut), Match_id: matchId })
            setMinute('')
            setJoueurId('')
            await load()
        } catch (e) {
            Alert.alert('Match', 'Impossible d\'ajouter le but')
        }
    }

    const removeBut = async (id) => {
        await deleteBut(id)
        await load()
    }

    const saveLieu = async () => {
        await updateMatch({ Match_id: matchId, lieu: editLieu })
        await load()
    }

    if (!match) return <View style={styles.center}><Text>Chargement...</Text></View>

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Match</Text>
            <Text style={styles.sub}>{equipe1?.nom || 'Equipe 1'} vs {equipe2?.nom || 'Equipe 2'}</Text>
            <Text style={styles.score}>{score1} - {score2}</Text>
            <Text style={styles.sub}>Tournoi: {tournois?.nom || 'Aucun'}</Text>

            {canManage && (
                <View style={styles.card}>
                    <Text style={styles.section}>Modifier le lieu</Text>
                    <TextInput value={editLieu} onChangeText={setEditLieu} style={styles.input} />
                    <Pressable style={styles.btn} onPress={saveLieu}><Text style={styles.btnText}>Enregistrer</Text></Pressable>
                </View>
            )}

            {canManage && (
                <View style={styles.card}>
                    <Text style={styles.section}>Ajouter un but</Text>
                    <FlatList
                        horizontal
                        data={allPlayers}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => setJoueurId(String(item.id))} style={[styles.pill, joueurId === String(item.id) && styles.pillSelected]}>
                                <Text>{item.prenom}</Text>
                            </Pressable>
                        )}
                    />
                    <TextInput placeholder="Minute" value={minute} onChangeText={setMinute} keyboardType="numeric" style={styles.input} />
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                        <Pressable style={[styles.pill, typeBut === '0' && styles.pillSelected]} onPress={() => setTypeBut('0')}><Text>Normal</Text></Pressable>
                        <Pressable style={[styles.pill, typeBut === '1' && styles.pillSelected]} onPress={() => setTypeBut('1')}><Text>Penalty</Text></Pressable>
                    </View>
                    <Pressable style={styles.btn} onPress={addBut}><Text style={styles.btnText}>Ajouter</Text></Pressable>
                </View>
            )}

            <Text style={styles.section}>Buts</Text>
            <FlatList
                data={buts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.butRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.butName}>{getPlayerName(item.User_id)}</Text>
                            <Text style={styles.butSub}>{item.Type_But ? 'Penalty' : 'Normal'}</Text>
                        </View>
                        {canManage && (
                            <Pressable style={styles.btnDanger} onPress={() => removeBut(item.id)}>
                                <Text style={styles.btnText}>Supprimer</Text>
                            </Pressable>
                        )}
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: '#fff', fontSize: 24, fontWeight: '700' },
    sub: { color: '#cbd5e1', marginTop: 4 },
    score: { color: '#fff', fontSize: 36, fontWeight: '800', marginVertical: 8 },
    card: { backgroundColor: '#1e293b', borderRadius: 10, padding: 12, marginTop: 10 },
    section: { color: '#fff', fontSize: 16, fontWeight: '700', marginVertical: 8 },
    input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 },
    btn: { backgroundColor: '#166534', borderRadius: 8, padding: 10, alignItems: 'center' },
    btnDanger: { backgroundColor: '#b91c1c', borderRadius: 8, padding: 10, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '700' },
    pill: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6 },
    pillSelected: { backgroundColor: '#86efac' },
    butRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 10, padding: 10, marginBottom: 8 },
    butName: { color: '#fff', fontWeight: '700' },
    butSub: { color: '#cbd5e1' },
})

/* function LegacyMatchDisplayWeb() {

    const [buts1, setButs1] = useState([])
    const [buts2, setButs2] = useState([])
    const [match, setMatch] = useState(null)
    const [equipe1, setEquipe1] = useState(null)
    const [equipe2, setEquipe2] = useState(null)
    const [tournois, setTournois] = useState(null)
    const [showAddBut, setShowAddBut] = useState(0)
    const [deleteButId, setDeleteButId] = useState(null)
    const [editBut, setEditBut] = useState(null)
    const [form, setForm] = useState({})
    const [editLieu, setEditLieu] = useState(null)
    const [editDate, setEditDate] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [showEditLieuModal, setShowEditLieuModal] = useState(false)
    const [showEditDateModal, setShowEditDateModal] = useState(false)

    const [refresh, setRefresh] = useState(false)
    const { id: matchId } = useParams()

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [timer, setTimer] = useState(null)

    async function handleEditLieu() {
        const response = await updateMatch({ lieu: editLieu, Match_id: matchId })

        setEditLieu(null)
        setShowEditLieuModal(false)
        setRefresh(!refresh)
    }

    async function handleEditDate() {
        const date = new Date(editDate)
        const response = await updateMatch({ date_heure: formaDate(date), Match_id: matchId })

        setEditDate(null)
        setShowEditDateModal(false)
        setRefresh(!refresh)
    }

    function addBut(id, n) {
        console.log(id, n)
        setShowAddBut(n)
        setForm({ Equipe_id: id, User_id: 0, Type_but: 0, date_heure: "" })
    }

    async function handleDeleteBut() {
        const reponse = await deleteBut(deleteButId)

        setDeleteButId(null)
        setRefresh(!refresh)
    }

    async function handleEditBut() {

        const errors = []
        if (!editBut.User_id) {
            errors.push("Veuillez selectionner un joueur")
        }
        if (![0, 1].includes(editBut.Type_but)) {
            errors.push("Veuillez selectionner un type de but")
        }
        if (!editBut.date_heure) {
            errors.push("Veillez renseigner la minute du but")
        }
        if (!/^(?:0|[1-9]\d?|1\d\d|200)$/.test(editBut.date_heure)) {
            errors.push("La date doit être un nombre entre 0 et 200")
        }
        if (errors.length != 0) return showError(errors)

        const date = new Date(new Date(match.date_heure).getTime() + editBut.date_heure * 60000) // Une minute en milliseconde

        const date_heure = formaDate(date)

        const response = await updateBut({ But_id: editBut.But_id, date_heure: date_heure, User_id: editBut.User_id, Type_But: editBut.Type_But, Match_id: matchId })

        setEditBut(null)

        if (response.error) showError([response.error.message])

        setRefresh(!refresh)
        showSuccess(response.data.message)
    }

    function getUserById(id) {
        const joueur = [...equipe1.Joueurs, ...equipe2.Joueurs]
        const joueurr = joueur.filter(j => j.id == id)[0]
        if (joueurr) return `${joueurr.prenom} ${joueurr.nom}`
    }

    async function handleSubmitBut(e) {
        e.preventDefault();

        const errors = []
        if (!form.User_id) {
            errors.push("Veuillez selectionner un joueur")
        }
        if (!form.Type_But) {
            errors.push("Veuillez selectionner un type de but")
        }
        if (!form.date_heure) {
            errors.push("Veillez renseigner la minute du but")
        }
        if (!/^(?:0|[1-9]\d?|1\d\d|200)$/.test(form.date_heure)) {
            errors.push("La date doit être un nombre entre 0 et 200")
        }
        if (errors.length != 0) return showError(errors)

        const date = new Date(new Date(match.date_heure).getTime() + form.date_heure * 60000) // Une minute en milliseconde

        const date_heure = formaDate(date)

        const response = await createBut({ date_heure: date_heure, User_id: form.User_id, Type_But: form.Type_But, Match_id: matchId })

        setShowAddBut(false)

        if (response.error) showError([response.error.message])

        setRefresh(!refresh)
        showSuccess(response.data.message)
    }

    function showError(errors) {
        if (errors.length == 0) return
        setTimer(null)
        setError(errors)
        setTimer(
            setTimeout(() => {
                setError(null)
            }, 5000)
        )
    }

    function showSuccess(sucess) {
        if (success.length == 0) return
        setTimer(null)
        setError(success)
        setTimer(
            setTimeout(() => {
                setError(null)
            }, 5000)
        )
    }

    // Match
    useEffect(() => {
        (async () => {

            try {
                const reponse = await getMatchById(matchId);
                setMatch(reponse.data.match[0]);
            } catch (err) {
                console.log(err)
            }
        })()
    }, [refresh])


    // Buts
    useEffect(() => {
        (async () => {
            try {
                if (equipe2 && equipe1 && equipe1.length != 0 && equipe2.length != 0) {

                    const buts = (await getButByMatch(matchId)).buts
                    setButs1([])
                    setButs2([])

                    const equipe1Id = []

                    equipe1.Joueurs.forEach(j => {
                        equipe1Id.push(j.id)
                    })

                    const but1 = []
                    const but2 = []
                    buts.forEach(but => {
                        if (equipe1Id.includes(but.User_id)) {
                            but1.push(but)
                        } else if (true) {
                            but2.push(but)
                        }
                    });
                    setButs1(but1)
                    setButs2(but2)
                }
            } catch (err) {
                console.log(err)
            }
        })();

    }, [equipe1, equipe2, refresh])

    // Equipe et tournois si il y en a un
    useEffect(() => {
        (async () => {
            try {
                if (match != null) {
                    if (match && match.Equipe1_id) {
                        setEquipe1(await infoEquipe({ Equipe_id: match.Equipe1_id }))
                        setEquipe2(await infoEquipe({ Equipe_id: match.Equipe2_id }))
                    }
                }
                if (match && match.Tournois_id) {
                    try {
                        const t = await findTournoisById(match.Tournois_id)
                        setTournois(t.data.Tournois[0])
                    } catch (err) {
                        console.log(err)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })();
    }, [match])

    useEffect(() => {
        (async () => {
            const user = await getUser()
            setCurrentUser(user.user[0])
        })()
    }, [])

    return (
        <div className="relative w-full min-h-screen">
            <Sidebar />

            <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                    src="/Pelouse.png"
                    alt="background"
                    className="fixed w-full h-full object-cover brightness-70"
                />
            </div>

            <div className="relative z-10 ml-16 p-6 space-y-6">
                <div className="w-full max-w-6xl mx-auto space-y-6">
                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg">
                        <h1 className="text-3xl font-bold text-white">Match</h1>
                        <p className="text-white/70">Détails et gestion du match</p>
                    </div>

                    <div className="backdrop-blur-md bg-white/20 rounded-xl border border-white/10 p-6 shadow-lg text-white">
                        {match ? (
                            <div className="space-y-6">
                                {equipe1 && equipe2 && (
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <h2 className="text-2xl font-semibold">
                                            {equipe1.nom} <span className="text-white/60">vs</span> {equipe2.nom}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Score</span>
                                            <span className="text-3xl font-bold">
                                                {buts1 && buts2 && (<>{buts1.length} - {buts2.length}</>)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-white/70 text-sm">Lieu</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span>{match.lieu || "Non défini"}</span>
                                            {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && (
                                                <button onClick={() => { setEditLieu(match.lieu); setShowEditLieuModal(true); }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                    <FaEdit />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-white/70 text-sm">Date et heure</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span>{match.date_heure ? new Date(match.date_heure).toLocaleString() : "Non définie"}</span>
                                            {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && (
                                                <button onClick={() => { 
                                                    const dateObj = match.date_heure ? new Date(match.date_heure) : new Date();
                                                    const localDateTime = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                                    setEditDate(localDateTime); 
                                                    setShowEditDateModal(true); 
                                                }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                    <FaEdit />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white/10 rounded-lg p-4">
                                        <p className="text-white/70 text-sm">Tournois</p>
                                        <p className="mt-2">{tournois?.nom || "Aucun"}</p>
                                    </div>
                                </div>

                                {equipe1 && equipe2 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white/10 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Buts de {equipe1.nom}</h3>
                                                {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && showAddBut != 1 && (
                                                    <button onClick={() => { addBut(equipe1.id, 1) }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                        <IoMdAdd />
                                                    </button>
                                                )}
                                            </div>

                                            {buts1.map((but) => (
                                                <div key={but.id} className="flex items-center justify-between rounded-md p-2 ">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{getUserById(but.User_id)}</p>
                                                        <p className="text-sm text-white/70">
                                                            {(new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000}° minute • {but.Type_but ? "Penalty" : "Normal"}
                                                        </p>
                                                    </div>
                                                    {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => {
                                                                setEditBut({
                                                                    User_id: but.User_id,
                                                                    date_heure: (new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000,
                                                                    Type_but: but.Type_but
                                                                })
                                                            }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                                <FaEdit />
                                                            </button>
                                                            <button onClick={() => { setDeleteButId(but.id) }} className="rounded-md bg-red-500/70 px-2 py-1 text-white hover:bg-red-600">
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white/10 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Buts de {equipe2.nom}</h3>
                                                {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && showAddBut != 2 && (
                                                    <button onClick={() => { addBut(equipe2.id, 2) }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                        <IoMdAdd />
                                                    </button>
                                                )}
                                            </div>

                                            {buts2.map((but) => (
                                                <div key={but.id} className="flex items-center justify-between rounded-md p-2">
                                                    <div className="space-y-1">
                                                        <p className="font-medium">{getUserById(but.User_id)}</p>
                                                        <p className="text-sm text-white/70">
                                                            {(new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000}° minute • {but.Type_But ? "Penalty" : "Normal"}
                                                        </p>
                                                    </div>
                                                    {currentUser && match && (match.Organisateur_id == currentUser.id || currentUser.type == "Admin") && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => {
                                                                setEditBut({
                                                                    User_id: but.User_id,
                                                                    date_heure: (new Date(but.date_heure).getTime() - new Date(match.date_heure).getTime()) / 60000,
                                                                    Type_but: but.Type_but
                                                                })
                                                            }} className="rounded-md bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                                                                <FaEdit />
                                                            </button>
                                                            <button onClick={() => { setDeleteButId(but.id) }} className="rounded-md bg-red-500/70 px-2 py-1 text-white hover:bg-red-600">
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <h2 className="text-white/70">aucun match avec cette id</h2>
                        )}
                    </div>
                    <ModalLayout isOpen={showAddBut != 0} handleModal={() => setShowAddBut(0)} onClose={() => setShowAddBut(0)}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center">Ajouter un but</p>
                            <form onSubmit={(e) => handleSubmitBut(e)} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Joueur</label>
                                    <select
                                        defaultValue={"Selectionner un Joueur"}
                                        name="butteur"
                                        required
                                        onChange={e => { setForm({ ...form, User_id: e.target.value }) }}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    >
                                        <option value="Selectionner un Joueur" disabled>
                                            Selectionner un Joueur
                                        </option>
                                        {showAddBut == 1 ? equipe1?.Joueurs.map(joueur =>
                                            <option value={joueur.id} key={joueur.id}>
                                                {joueur.prenom} - {joueur.nom}
                                            </option>
                                        ) : equipe2?.Joueurs.map(joueur =>
                                            <option value={joueur.id} key={joueur.id}>
                                                {joueur.prenom} - {joueur.nom}
                                            </option>
                                        )}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Type de but</label>
                                    <select
                                        name="type"
                                        required
                                        value={form.Type_But}
                                        onChange={e => setForm({ ...form, Type_But: e.target.value })}
                                        defaultValue={"Type de but"}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    >
                                        <option value="Type de but" disabled>
                                            Type de but
                                        </option>
                                        <option value="0">Normal</option>
                                        <option value="1">Penalty</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Minute du but</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={200}
                                        required
                                        placeholder='Minute du but...'
                                        value={form.date_heure}
                                        onChange={e => setForm({ ...form, date_heure: e.target.value })}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => setShowAddBut(false)} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">
                                        Annuler
                                    </button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">
                                        Ajouter
                                    </button>
                                </div>
                            </form>
                        </div>  
                    </ModalLayout>

                    <ModalLayout isOpen={!!error} handleModal={() => setError(null)} onClose={() => { setTimer(null) }}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center text-red-600">Erreur</p>
                            <ul className="space-y-2 mb-6 text-slate-700">
                                {error?.map((e, index) =>
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-500 font-bold">•</span>
                                        <span>{e}</span>
                                    </li>
                                )}
                            </ul>
                            <div className="flex justify-end">
                                <button onClick={() => { setError(null); setTimer(null); }} className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">
                                    OK
                                </button>
                            </div>
                        </div>
                    </ModalLayout>

                    <ModalLayout isOpen={deleteButId != null} handleModal={() => setDeleteButId(null)} onClose={() => { setDeleteButId(null) }}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center">Supprimer le but</p>
                            <p className="text-center mb-6 text-slate-700">Êtes-vous sûr de vouloir supprimer ce but ?</p>
                            <div className="flex justify-end gap-4">
                                <button onClick={() => { setDeleteButId(null) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">Annuler</button>
                                <button onClick={() => { handleDeleteBut() }} className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600">Supprimer</button>
                            </div>
                        </div>
                    </ModalLayout>

                    <ModalLayout isOpen={editBut != null} handleModal={() => setEditBut(null)} onClose={() => { setEditBut(null) }}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center">Modifier le but</p>
                            <form onSubmit={(e) => { e.preventDefault(); handleEditBut(); }} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Joueur</label>
                                    <select
                                        name="User_id"
                                        value={editBut?.User_id}
                                        defaultValue={editBut?.User_id}
                                        onChange={(e) => { setEditBut({ ...editBut, User_id: e.target.value }) }}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    >
                                        {equipe1?.Joueurs.filter(j => j.id == editBut?.User_id).length != 0 ? (
                                            <>
                                                {equipe1?.Joueurs.map((joueur, key) =>
                                                    <option value={joueur.id} key={key}>
                                                        {joueur.prenom} - {joueur.nom}
                                                    </option>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {equipe2?.Joueurs.map((joueur, key) =>
                                                    <option value={joueur.id} key={key}>
                                                        {joueur.prenom} - {joueur.nom}
                                                    </option>
                                                )}
                                            </>
                                        )}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Type de but</label>
                                    <select
                                        name="Type_but"
                                        defaultValue={editBut?.Type_but}
                                        value={editBut?.Type_but}
                                        onChange={(e) => { setEditBut({ ...editBut, Type_but: e.target.value }) }}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    >
                                        <option value="0">Normal</option>
                                        <option value="1">Penalty</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Minute du but</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={200}
                                        defaultValue={editBut?.date_heure}
                                        value={editBut?.date_heure}
                                        onChange={(e) => { setEditBut({ ...editBut, date_heure: e.target.value }) }}
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2"
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => { setEditBut(null) }} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100">Annuler</button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600">Confirmer</button>
                                </div>
                            </form>
                        </div>
                    </ModalLayout>

                    <ModalLayout isOpen={showEditLieuModal} handleModal={() => setShowEditLieuModal(false)}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center">Modifier le lieu</p>
                            <form onSubmit={(e) => { e.preventDefault(); handleEditLieu(); }} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Lieu du match</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Lieu du match..." 
                                        value={editLieu || ""} 
                                        onChange={(e) => setEditLieu(e.target.value)} 
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" 
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => setShowEditLieuModal(false)} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Confirmer</button>
                                </div>
                            </form>
                        </div>
                    </ModalLayout>

                    <ModalLayout isOpen={showEditDateModal} handleModal={() => setShowEditDateModal(false)}>
                        <div className="w-[450px] min-w-[380px] bg-orange-50 border-2 border-orange-200 shadow-xl px-10 py-8 rounded-lg flex flex-col justify-center">
                            <p className="font-semibold text-xl mb-6 flex justify-center">Modifier la date</p>
                            <form onSubmit={(e) => { e.preventDefault(); handleEditDate(); }} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-md font-medium">Date et heure du match</label>
                                    <input 
                                        type="datetime-local" 
                                        required 
                                        value={editDate || ""} 
                                        onChange={(e) => setEditDate(e.target.value)} 
                                        className="px-3 py-2 rounded-sm outline outline-1 outline-orange-800 hover:outline-2" 
                                    />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => setShowEditDateModal(false)} className="px-4 py-2 rounded-md border border-orange-300 hover:bg-orange-100" >Annuler</button>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600" >Confirmer</button>
                                </div>
                            </form>
                        </div>
                    </ModalLayout>
                </div>
            </div>
        </div>
    )
}
*/
