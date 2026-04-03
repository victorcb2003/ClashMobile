import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  content: { padding: 16 },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#d1d5db", marginBottom: 14 },
  card: { backgroundColor: "rgba(17,24,39,0.66)", borderRadius: 10, padding: 12, marginBottom: 12 },
  cardTitle: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  row: { paddingVertical: 8, borderTopColor: "rgba(255,255,255,0.15)", borderTopWidth: 1 },
  rowTitle: { color: "#fff", fontWeight: "600" },
  textMuted: { color: "#cbd5e1" },
  quickRow: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: { flex: 1, backgroundColor: "#166534", paddingVertical: 10, borderRadius: 8, marginHorizontal: 4, alignItems: "center" },
  quickBtnText: { color: "#fff", fontWeight: "700" },
})
