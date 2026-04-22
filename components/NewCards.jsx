import { View, Text, Image, StyleSheet } from 'react-native'

const NEWS = [
  { id: 0, title: 'News n°1', desc: 'Bienvenue sur Clash of League. Suivez vos tournois, équipes et matchs en temps réel.' },
  { id: 1, title: 'News n°2', desc: 'Nouvelle saison disponible ! Inscrivez votre équipe et participez aux tournois.' },
]

export default function NewsCard() {
  return (
    <View style={s.card}>
      <Text style={s.title}>Actualités</Text>
      {NEWS.map(n => (
        <View key={n.id} style={s.row}>
          <Image source={require('../assets/icon.png')} style={s.img} resizeMode="contain" />
          <View style={s.text}>
            <Text style={s.newsTitle}>{n.title}</Text>
            <Text style={s.newsDesc}>{n.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  img: { width: 48, height: 48 },
  text: { flex: 1 },
  newsTitle: { color: '#fff', fontWeight: '600', marginBottom: 2 },
  newsDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 18 },
})
