import { useEffect, useMemo, useState } from 'react'
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthProvider'
import { getButByMatch } from '../services/butService'
import { getEquipeById } from '../services/equipeService'

export default function MatchSummaryCard({ matches = [], navigation }) {
  const { user } = useAuth()
  const [teamById, setTeamById] = useState({})
  const [goalsByMatchId, setGoalsByMatchId] = useState({})
  const [visibleCount, setVisibleCount] = useState(10)

  useEffect(() => {
    if (!matches.length) return
    ;(async () => {
      const visible = matches.slice(0, visibleCount)
      const idsToFetch = [...new Set(
        visible.flatMap(m => [m.Equipe1_id, m.Equipe2_id]).filter(id => id && !teamById[id])
      )]
      if (idsToFetch.length) {
        const teams = await Promise.all(idsToFetch.map(id => getEquipeById(id)))
        setTeamById(prev => {
          const u = { ...prev }
          teams.forEach((t, i) => { u[idsToFetch[i]] = t?.equipe || t?.Equipe || t })
          return u
        })
      }
      const toFetch = visible.filter(m => !goalsByMatchId[m.id])
      if (toFetch.length) {
        const results = await Promise.all(
          toFetch.map(async m => [m.id, (await getButByMatch(m.id))?.buts || []])
        )
        setGoalsByMatchId(prev => {
          const u = { ...prev }
          results.forEach(([id, g]) => { u[id] = g })
          return u
        })
      }
    })()
  }, [matches, visibleCount])

  const playerNameById = useMemo(() => {
    const map = {}
    Object.values(teamById).forEach(t =>
      (t?.Joueurs || []).forEach(p => { map[p.id] = `${p.prenom || ''} ${p.nom || ''}`.trim() })
    )
    return map
  }, [teamById])

  const computeSummary = match => {
    const team1 = match?.Equipe1 || teamById[match?.Equipe1_id]
    const team2 = match?.Equipe2 || teamById[match?.Equipe2_id]
    const team1Ids = new Set((team1?.Joueurs || []).map(j => j.id))
    const goals = goalsByMatchId[match.id] || []
    let s1 = 0, s2 = 0
    const ls = [], rs = []
    goals.forEach(g => {
      const min = Math.max(0, Math.round((new Date(g.date_heure) - new Date(match.date_heure)) / 60000))
      const name = playerNameById[g.User_id] || 'Joueur'
      if (team1Ids.has(g.User_id)) { s1++; ls.push(`${name} ${min}'`) }
      else { s2++; rs.push(`${name} ${min}'`) }
    })
    const currentTeamId = user?.Equipe_id
    let status = 'tie'
    if (currentTeamId === match?.Equipe1_id)
      status = s1 > s2 ? 'win' : s1 < s2 ? 'lose' : 'tie'
    else if (currentTeamId === match?.Equipe2_id)
      status = s2 > s1 ? 'win' : s2 < s1 ? 'lose' : 'tie'
    return {
      team1Name: team1?.nom || 'Équipe 1',
      team2Name: team2?.nom || 'Équipe 2',
      tournoiName: match?.Tournois?.nom || 'Match amical',
      s1, s2, ls, rs, status,
    }
  }

  if (!matches.length) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyText}>Aucun match à afficher.</Text>
      </View>
    )
  }

  const statusColors = {
    win:  { bg: 'hsla(130,45%,15%,0.75)', border: 'hsl(130,45%,75%)' },
    lose: { bg: 'hsla(10,55%,15%,0.75)',  border: 'hsl(10,55%,75%)' },
    tie:  { bg: 'hsla(0,0%,15%,0.75)',    border: 'hsl(0,0%,65%)' },
  }

  return (
    <View style={{ gap: 10 }}>
      {matches.slice(0, visibleCount).map(match => {
        const { team1Name, team2Name, tournoiName, s1, s2, ls, rs, status } = computeSummary(match)
        const col = statusColors[status] || statusColors.tie
        return (
          <Pressable
            key={match.id}
            style={[s.card, { backgroundColor: col.bg, borderColor: col.border }]}
            onPress={() => navigation?.navigate?.('MatchDisplay', { id: match.id })}
          >
            <Text style={s.tournoi}>{tournoiName}</Text>

            <View style={s.scoreRow}>
              <View style={s.scorerCol}>
                {ls.length ? ls.map((l, i) => <Text key={i} style={s.scorer} numberOfLines={1}>{l}</Text>)
                  : <Text style={s.scorer}>—</Text>}
              </View>

              <View style={s.scoreCenter}>
                <Text style={s.score}>{s1}</Text>
                <Text style={s.dash}>-</Text>
                <Text style={s.score}>{s2}</Text>
              </View>

              <View style={s.scorerColRight}>
                {rs.length ? rs.map((r, i) => <Text key={i} style={s.scorer} numberOfLines={1}>{r}</Text>)
                  : <Text style={s.scorer}>—</Text>}
              </View>
            </View>

            <View style={s.teamRow}>
              <Text style={s.teamName}>{team1Name}</Text>
              <Text style={s.teamName}>{team2Name}</Text>
            </View>
          </Pressable>
        )
      })}
      {visibleCount < matches.length && (
        <Pressable style={s.moreBtn} onPress={() => setVisibleCount(p => p + 5)}>
          <Text style={s.moreBtnText}>Voir plus</Text>
        </Pressable>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  empty: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 20 },
  emptyText: { color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  card: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    borderTopWidth: 3,
  },
  tournoi: { color: '#e2e8f0', fontSize: 12, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  scorerCol: { flex: 1, alignItems: 'flex-end' },
  scorerColRight: { flex: 1, alignItems: 'flex-start' },
  scorer: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  scoreCenter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
  score: { color: '#fff', fontSize: 32, fontWeight: '900' },
  dash: { color: '#fff', fontSize: 28, fontWeight: '900' },
  teamRow: { flexDirection: 'row', justifyContent: 'space-around' },
  teamName: { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'center' },
  moreBtn: { backgroundColor: '#166534', borderRadius: 8, padding: 10, alignItems: 'center' },
  moreBtnText: { color: '#dcfce7', fontWeight: '700' },
})
