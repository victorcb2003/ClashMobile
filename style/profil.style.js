import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a00" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700" },
  name: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 8 },
  sub: { color: "#cbd5e1" },
  card: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginTop: 12 },
  section: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", marginTop: 12 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { backgroundColor: "#166534", borderRadius: 8, padding: 10, alignItems: "center", marginRight: 8 },
  supBtn: { backgroundColor: "#DE3918", borderRadius: 8, padding: 10, alignItems: "center", marginRight: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12 },
  optionText: { color: "#fff", fontSize: 16, marginLeft: 12, },
  sectionBlock: { backgroundColor: "#1e293b", borderRadius: 10, marginTop: 16, overflow: "hidden" },
})
