import { useEffect, useState } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getUser } from '../services/authService'
import { findAllEquipe } from '../services/equipeService'

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function sameDay(a, b) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

function matchesForDate(matches, date) {
  return matches.filter(m => sameDay(new Date(m.date_heure), date))
}

const DAYS_FULL = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
const MONTHS    = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

export default function CalendarStrip({ navigation }) {
  const today = new Date()
  const [matches,  setMatches]  = useState([])
  const [equipes,  setEquipes]  = useState([])
  const [selected, setSelected] = useState(today)

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
  const dayMatches = matchesForDate(matches, selected)
  const isToday = sameDay(selected, today)

  const label = `${DAYS_FULL[selected.getDay()]} ${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`

  return (
    <View style={s.wrap}>
      {/* Navigation jour */}
      <View style={s.header}>
        <Pressable onPress={() => setSelected(d => addDays(d, -1))}>
          <Ionicons name="arrow-back-circle" size={26} color="rgba(255,255,255,0.6)" />
        </Pressable>
        <View style={s.labelWrap}>
          <Text style={s.label}>{label}</Text>
          {isToday && <View style={s.todayBadge}><Text style={s.todayText}>Aujourd'hui</Text></View>}
        </View>
        <Pressable onPress={() => setSelected(d => addDays(d, 1))}>
          <Ionicons name="arrow-forward-circle" size={26} color="rgba(255,255,255,0.6)" />
        </Pressable>
      </View>

      {/* Matchs du jour */}
      {dayMatches.length === 0 ? (
        <Text style={s.noMatch}>Aucun match ce jour</Text>
      ) : dayMatches.map(m => (
        <Pressable
          key={m.id}
          style={s.matchChip}
          onPress={() => navigation?.navigate?.('MatchDisplay', { id: m.id })}
        >
          <Text style={s.chipTime}>
            {new Date(m.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={s.chipTeams}>
            <Text style={s.chipTeam} numberOfLines={1}>{getName(m.Equipe1_id)}</Text>
            <Text style={s.chipVs}>VS</Text>
            <Text style={s.chipTeam} numberOfLines={1}>{getName(m.Equipe2_id)}</Text>
          </View>
          {m.lieu ? <Text style={s.chipLieu}>{m.lieu}</Text> : null}
        </Pressable>
      ))}
    </View>
  )
}

const s = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: 14,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelWrap: { alignItems: 'center', gap: 4 },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  todayBadge: {
    backgroundColor: '#15803d',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  todayText: { color: '#dcfce7', fontSize: 10, fontWeight: '700' },
  noMatch: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  matchChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 8,
  },
  chipTime: { color: '#4ade80', fontSize: 12, fontWeight: '700', marginBottom: 6 },
  chipTeams: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipTeam: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 },
  chipVs: { color: '#4ade80', fontSize: 11, fontWeight: '800' },
  chipLieu: { color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 4 },
})