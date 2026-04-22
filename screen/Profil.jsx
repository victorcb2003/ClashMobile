import { useEffect, useState } from 'react'
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { getUser, updateUser, changePassword, setImageProfil, deleteImageProfil } from '../services/authService'
import { equipeMe } from '../services/equipeService'
import { useAuth } from '../context/AuthProvider'
import Avatar from '../components/Avatar'

export default function Profil({ navigation }) {
  const { authLogout } = useAuth()
  const [user,   setUser]   = useState(null)
  const [equipe, setEquipe] = useState(null)
  const [matchs, setMatchs] = useState([])

  const [editOpen, setEditOpen] = useState(false)
  const [pwdOpen,  setPwdOpen]  = useState(false)
  const [imgOpen,  setImgOpen]  = useState(false)

  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '' })
  const [pwdData,  setPwdData]  = useState({ current: '', newPwd: '', confirm: '' })

  const load = async () => {
    try {
      const u = await getUser()
      const cu = u?.user?.[0] || null
      setUser(cu)
      setMatchs(u?.match || [])
      setFormData({ prenom: cu?.prenom || '', nom: cu?.nom || '', email: cu?.email || '' })
    } catch (err) { console.error(err) }

    try {
      const e = await equipeMe()
      setEquipe(e?.equipe || null)
    } catch { setEquipe(null) }
  }

  useEffect(() => { load() }, [])

  const handleUpdateUser = async () => {
    try {
      await updateUser({ id: user.id, ...formData })
      setEditOpen(false)
      await load()
    } catch { Alert.alert('Profil', 'Erreur de mise à jour') }
  }

  const handleChangePwd = async () => {
    if (pwdData.newPwd !== pwdData.confirm) {
      Alert.alert('Profil', 'Les mots de passe ne correspondent pas')
      return
    }
    try {
      await changePassword({ id: user.id, currentPassword: pwdData.current, newPassword: pwdData.newPwd })
      setPwdOpen(false)
      setPwdData({ current: '', newPwd: '', confirm: '' })
      Alert.alert('Profil', 'Mot de passe modifié ✓')
    } catch { Alert.alert('Profil', 'Erreur lors du changement') }
  }

  const handlePickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 })
    if (res.canceled || !res.assets?.[0]) return
    const asset = res.assets[0]
    const fd = new FormData()
    fd.append('image', { uri: asset.uri, type: 'image/jpeg', name: 'profil.jpg' })
    await setImageProfil({ id: user.id, imageFile: fd })
    setImgOpen(false)
    await load()
  }

  const handleDeleteImage = async () => {
    await deleteImageProfil({ id: user.id })
    setImgOpen(false)
    await load()
  }

  if (!user) return <View style={s.center}><Text style={{ color: '#fff' }}>Chargement...</Text></View>

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      <View style={s.headerCard}>
        <Pressable onPress={() => setImgOpen(v => !v)} style={s.avatarWrap}>
          <Avatar user={user} size="lg" />
          <View style={s.cameraBadge}><Ionicons name="camera" size={14} color="#fff" /></View>
        </Pressable>
        <View style={s.headerInfo}>
          <Text style={s.userName}>{user.prenom} {user.nom}</Text>
          <Text style={s.userEmail}>{user.email}</Text>
        </View>
        <Pressable style={s.editProfileBtn} onPress={() => setEditOpen(v => !v)}>
          <Text style={s.editProfileText}>Modifier</Text>
        </Pressable>
      </View>

      {imgOpen && (
        <View style={s.card}>
          <View style={{ alignItems: 'center', marginBottom: 14 }}>
            <Avatar user={user} size="xl" />
          </View>
          <Pressable style={s.greenBtn} onPress={handlePickImage}>
            <Text style={s.greenText}>{user.img_url ? 'Remplacer la photo' : 'Ajouter une photo'}</Text>
          </Pressable>
          {user.img_url && (
            <Pressable style={[s.dangerBtn, { marginTop: 8 }]} onPress={handleDeleteImage}>
              <Text style={s.dangerText}>Supprimer la photo</Text>
            </Pressable>
          )}
          <Pressable style={[s.ghostBtn, { marginTop: 8 }]} onPress={() => setImgOpen(false)}>
            <Text style={s.ghostText}>Fermer</Text>
          </Pressable>
        </View>
      )}

      {editOpen && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Modifier les informations</Text>
          {[['Prénom', 'prenom'], ['Nom', 'nom']].map(([label, key]) => (
            <View key={key}>
              <Text style={s.inputLabel}>{label}</Text>
              <TextInput
                style={s.input}
                value={formData[key]}
                onChangeText={v => setFormData(f => ({ ...f, [key]: v }))}
                placeholder={`${label}...`}
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
          <View style={s.rowEnd}>
            <Pressable style={s.ghostBtn} onPress={() => setEditOpen(false)}>
              <Text style={s.ghostText}>Annuler</Text>
            </Pressable>
            <Pressable style={s.greenBtn} onPress={handleUpdateUser}>
              <Text style={s.greenText}>Confirmer</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={s.card}>
        <Text style={s.sectionTitle}>Informations</Text>
        {[['Prénom', user.prenom], ['Nom', user.nom], ['Email', user.email]].map(([l, v]) => (
          <View key={l} style={{ marginBottom: 8 }}>
            <Text style={s.infoLabel}>{l}</Text>
            <Text style={s.infoValue}>{v || '—'}</Text>
          </View>
        ))}
        <Pressable style={[s.greenBtn, { marginTop: 6 }]} onPress={() => setPwdOpen(v => !v)}>
          <Text style={s.greenText}>Changer le mot de passe</Text>
        </Pressable>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Statistiques</Text>
        <View style={s.statBox}>
          <Text style={s.statNum}>{matchs.length}</Text>
          <Text style={s.statLabel}>Matchs joués</Text>
        </View>
      </View>

      {pwdOpen && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>Changer le mot de passe</Text>
          {[['Actuel', 'current'], ['Nouveau', 'newPwd'], ['Confirmer', 'confirm']].map(([label, key]) => (
            <View key={key}>
              <Text style={s.inputLabel}>{label}</Text>
              <TextInput
                secureTextEntry
                style={s.input}
                value={pwdData[key]}
                onChangeText={v => setPwdData(p => ({ ...p, [key]: v }))}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
              />
            </View>
          ))}
          <View style={s.rowEnd}>
            <Pressable style={s.ghostBtn} onPress={() => setPwdOpen(false)}>
              <Text style={s.ghostText}>Annuler</Text>
            </Pressable>
            <Pressable style={s.greenBtn} onPress={handleChangePwd}>
              <Text style={s.greenText}>Confirmer</Text>
            </Pressable>
          </View>
        </View>
      )}

      {equipe && (
        <View style={s.card}>
          <Text style={s.sectionTitle}>
            {user.Pending_Equipe != null ? 'Demande en attente :' : 'Équipe :'}
          </Text>
          <Pressable
            style={s.equipeRow}
            onPress={() => navigation?.navigate?.('EquipeDisplay', { id: equipe.id })}
          >
            <Avatar equipe={equipe} size="sm" />
            <Text style={s.equipeName}>{equipe.nom}</Text>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
          </Pressable>
        </View>
      )}

      <View style={s.card}>
        <Pressable style={s.logoutRow} onPress={authLogout}>
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
          <Text style={s.logoutText}>Se déconnecter</Text>
        </Pressable>
      </View>

    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  headerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    padding: 20, marginBottom: 14,
  },
  avatarWrap: { position: 'relative' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#16a34a', borderRadius: 10, padding: 4 },
  headerInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  editProfileBtn: { backgroundColor: '#15803d', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  editProfileText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  card: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', padding: 16, marginBottom: 14 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  inputLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, color: '#111', marginBottom: 12 },
  infoLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11 },
  infoValue: { color: '#fff', fontSize: 14 },

  statBox: { alignItems: 'center', marginTop: 4 },
  statNum: { color: '#fff', fontSize: 40, fontWeight: '900' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  equipeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  equipeName: { color: '#fff', fontWeight: '600', flex: 1 },

  rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
  greenBtn: { backgroundColor: '#15803d', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  greenText: { color: '#fff', fontWeight: '700' },
  dangerBtn: { backgroundColor: '#7f1d1d', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  dangerText: { color: '#fca5a5', fontWeight: '700' },
  ghostBtn: { borderWidth: 1, borderColor: '#475569', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center' },
  ghostText: { color: '#94a3b8' },

  logoutRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoutText: { color: '#f87171', fontSize: 15, fontWeight: '600' },
})