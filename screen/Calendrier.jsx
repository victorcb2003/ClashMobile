import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getUser } from '../services/authService'
import { findAllEquipe } from '../services/equipeService'

const DAYS_LONG = ['LUN','MAR','MER','JEU','VEN','SAM','DIM']
const MONTHS    = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
const getFirstDay    = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }
const sameDay        = (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
const matchesForDate = (matches, date) => matches.filter(m => sameDay(new Date(m.date_heure), date))

export default function Calendrier({ navigation }) {
  const today = new Date()
  const [matches,      setMatches]      = useState([])
  const [equipes,      setEquipes]      = useState([])
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(today)

  useEffect(() => {
    ;(async () => {
      try {
        const [u, e] = await Promise.all([getUser(), findAllEquipe()])
        setMatches(u?.match || [])
        setEquipes(e?.equipes || [])
      } catch (_) {}
    })()
  }, [])

  const getName = id => equipes.find(e => e.id == id)?.nom || `#${id}`

  const daysInMonth    = getDaysInMonth(currentYear, currentMonth)
  const firstDay       = getFirstDay(currentYear, currentMonth)
  const cells          = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selectedMatches = matchesForDate(matches, selectedDate)

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1) }
    else setCurrentMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1) }
    else setCurrentMonth(m => m + 1)
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

      {/* Calendrier */}
      <View style={s.calCard}>
        <View style={s.monthNav}>
          <Pressable onPress={prevMonth}>
            <Ionicons name="arrow-back-circle" size={28} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <Text style={s.monthTitle}>{MONTHS[currentMonth]} {currentYear}</Text>
          <Pressable onPress={nextMonth}>
            <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        <View style={s.dayNames}>
          {DAYS_LONG.map(d => <Text key={d} style={s.dayNameText}>{d}</Text>)}
        </View>

        <View style={s.grid}>
          {cells.map((day, i) => {
            if (!day) return <View key={i} style={s.cellEmpty} />
            const date       = new Date(currentYear, currentMonth, day)
            const isToday    = sameDay(date, today)
            const isSelected = sameDay(date, selectedDate)
            const hasMatch   = matchesForDate(matches, date).length > 0
            return (
              <Pressable
                key={i}
                style={[s.cell, isSelected && s.cellSelected, isToday && !isSelected && s.cellToday]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[s.cellText, isSelected && s.cellTextSelected]}>{day}</Text>
                {hasMatch && <View style={[s.dot, isSelected && s.dotDark]} />}
              </Pressable>
            )
          })}
        </View>
      </View>

      {/* Matchs du jour sélectionné */}
      <View style={s.dayMatchesCard}>
        <Text style={s.dayTitle}>
          {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        {selectedMatches.length === 0 ? (
          <Text style={s.noMatch}>Aucun match prévu ce jour</Text>
        ) : selectedMatches.map(m => (
          <Pressable
            key={m.id}
            style={s.matchItem}
            onPress={() => navigation?.navigate?.('MatchDisplay', { id: m.id })}
          >
            <Text style={s.matchTime}>
              {new Date(m.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={s.matchTeams}>
              {getName(m.Equipe1_id)} <Text style={s.vs}>VS</Text> {getName(m.Equipe2_id)}
            </Text>
            {m.lieu ? <Text style={s.matchLieu}>{m.lieu}</Text> : null}
          </Pressable>
        ))}
      </View>

    </ScrollView>
  )
}

const CELL_SIZE = 44

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 14, paddingBottom: 100 },

  calCard: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  monthTitle: { color: '#fff', fontWeight: '800', fontSize: 16, textTransform: 'uppercase', letterSpacing: 0.5 },

  dayNames: { flexDirection: 'row', paddingHorizontal: 8, paddingTop: 10 },
  dayNameText: { flex: 1, textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '800' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  cellEmpty: { width: '14.28%', height: CELL_SIZE },
  cell: { width: '14.28%', height: CELL_SIZE, alignItems: 'center', justifyContent: 'center', borderRadius: 100 },
  cellSelected: { backgroundColor: '#fff' },
  cellToday: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  cellText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
  cellTextSelected: { color: '#111', fontWeight: '800' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4ade80', position: 'absolute', bottom: 4 },
  dotDark: { backgroundColor: '#111' },

  dayMatchesCard: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 16,
  },
  dayTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', fontWeight: '700', marginBottom: 12 },
  noMatch: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontStyle: 'italic', paddingVertical: 12 },
  matchItem: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  matchTime: { color: '#4ade80', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  matchTeams: { color: '#fff', fontSize: 13 },
  vs: { color: '#4ade80', fontWeight: '800', fontSize: 11 },
  matchLieu: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },
})