import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  overlay: { flex: 1, padding: 16, backgroundColor: "rgba(15,23,42,0.45)" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  error: { color: "#fecaca", marginBottom: 8 },
  item: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 10, padding: 12, marginBottom: 8, alignItems: "center" },
  itemInfo: { flex: 1 },
  itemName: { color: "#fff", fontWeight: "700" },
  itemSub: { color: "#d1d5db", fontSize: 12 },
  btn: { backgroundColor: "#166534", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
})
