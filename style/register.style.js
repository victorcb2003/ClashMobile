import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundLayer: {
        ...StyleSheet.absoluteFill,
        zIndex: 0,
    },
    backgroundImage: {
        height: "100%",
        width: "100%",
    },
    foreground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        zIndex: 1,
    },
    card: {
        width: "100%",
        maxWidth: 390,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 20,
        backgroundColor: "rgba(24, 33, 24, 0.62)",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 18,
    },
    fieldGroup: {
        marginBottom: 12,
    },
    label: {
        color: "#FFFFFF",
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: "#111827",
    },
    roleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    roleButton: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
    },
    roleButtonSelected: {
        backgroundColor: "#16A34A",
        borderColor: "#16A34A",
    },
    roleButtonText: {
        color: "#111827",
        fontSize: 12,
        fontWeight: "600",
    },
    buttonRow: {
        marginTop: 8,
        alignItems: "flex-end",
    },
    button: {
        backgroundColor: "#166534",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
})
