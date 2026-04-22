import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f172a00" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10 },
  rowBtns: { flexDirection: "row", justifyContent: "flex-end" },
  btn: { backgroundColor: "#166534", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  btnGhost: { borderWidth: 1, borderColor: "#94a3b8", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, backgroundColor: "#fff" },
  item: { backgroundColor: "#1e293b", borderRadius: 10, padding: 12, marginBottom: 8 },
  itemTitle: { color: "#fff", fontWeight: "700" },
  itemSub: { color: "#cbd5e1" },
  empty: { color: "#cbd5e1" },
})
