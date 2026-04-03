import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 10 },
  section: { color: "#fff", fontWeight: "700", marginTop: 8, marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { backgroundColor: "#166534", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", marginLeft: 8 },
  btnGhost: { borderWidth: 1, borderColor: "#94a3b8", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#fff" },
  btnText: { color: "#fff", fontWeight: "700" },
  pill: { backgroundColor: "#fff", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6 },
  pillSelected: { backgroundColor: "#86efac" },
  item: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 8 },
  itemTitle: { color: "#fff", fontWeight: "700" },
  itemSub: { color: "#cbd5e1" },
  rowEnd: { flexDirection: "row", justifyContent: "flex-end" },
})
