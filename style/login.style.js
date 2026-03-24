import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		position: "relative",
		flex: 1,
		width: "100%",
		overflow: "hidden",
	},
	backgroundLayer: {
		...StyleSheet.absoluteFillObject,
		zIndex: 0,
	},
	foreground: {
		position: "relative",
		zIndex: 10,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: 360,
		paddingHorizontal: 40,
		paddingVertical: 32,
		borderRadius: 12,
		backgroundColor: "hsla(130, 10%, 15%, 0.65)",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 24,
		color: "#fff",
	},
	fieldGroup: {
		width: "100%",
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "500",
		color: "#fff",
		marginBottom: 8,
	},
	input: {
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 16,
		borderWidth: 1,
		borderColor: "#d4d4d4",
		color: "#000",
		backgroundColor: "#fff",
	},
	buttonRow: {
		width: "100%",
		alignItems: "flex-end",
	},
	button: {
		borderRadius: 6,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: "#166534",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
	},
})