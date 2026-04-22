import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { getUser } from '../services/authService'
import CalendarStrip from '../components/Calendar'
import MatchSummaryCard from '../components/MatchSummaryCard'
import NewsCard from '../components/NewCards'

export default function Home({ navigation }) {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getUser()
        setMatches(data?.match || [])
      } catch (e) { console.error(e) }
    })()
  }, [])

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <CalendarStrip navigation={navigation} />
      <View style={s.section}>
        <Text style={s.sectionTitle}>Mes matchs</Text>
        <MatchSummaryCard matches={matches} navigation={navigation} />
      </View>
      <NewsCard />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 10 },
})