import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a00" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700" },
  sub: { color: "#ccc", marginTop: 4 },
  score: { color: "#fff", fontSize: 36, fontWeight: "800", marginVertical: 8 },
  card: { backgroundColor: "#1e293b", borderRadius: 8,  padding: 14, marginTop: 12, },
  section: { color: "#fff", fontSize: 16, fontWeight: "700", marginVertical: 8 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { backgroundColor: "#166534", borderRadius: 6, paddingVertical: 10, alignItems: "center", },
  btnDanger: { backgroundColor: "#7f1d1d", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10, },
  btnText: { color: "#fff", fontWeight: "700" },
  pill: { backgroundColor: "#334155", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6, marginTop: 4, marginBottom: 8 },
  pillSelected: { backgroundColor: "#166534", },
  butRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 6, padding: 12, marginBottom: 6, },
  butName: { color: "#fff", fontWeight: "700" },
  butSub: { color: "#ccc" },
  typeRow: { flexDirection: "row", marginBottom: 8 },
  butInfo: { flex: 1 },
})
