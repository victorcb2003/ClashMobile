import { useState } from "react"
import { login } from "../services/authService"
import { Pressable, View, Text, TextInput, Image } from "react-native"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // const navigate = useNavigate()

    // Modal
    const [isOpen, setIsOpen] = useState(false)


    const handleSubmit = async () => {
        try {
            const response = await login({
                email: email,
                password: password,
            })
            // navigate("/home")
        } catch (error) {
            setIsOpen(true)
            setErrorMessage("Erreur lors de la connexion.")
            setTimeout(() => {
                setIsOpen(false)
            }, 2000);
            console.error(error)
        }
    }

    const handleModal = () => {
        setIsOpen(false)
    }

    return (
        <>
            <View className="relative h-screen w-full overflow-hidden">
                <View className="absolute inset-0 z-0">
                    <View className="absolute inset-0 z-0 pointer-events-none">
                        <Image
                            source={require("../public/Pelouse.png")}
                            className="fixed w-full h-full object-cover brightness-75"
                        />
                    </View>
                </View>

                <View className="relative z-10 h-full flex justify-center items-center">
                    <View className=" w-[360px] shadow-lg px-10 py-8 rounded-xl flex flex-col justify-center text-green-50 gap-4" style={{ backgroundColor: "hsla(130, 10%, 15%, 0.65)" }} >
                        <Text className="font-semibold text-xl mb-8 text-white">Connexion</Text>

                        <View className="flex flex-col justify-center gap-2 w-full">
                            <Text className="text-md font-medium color-white">Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail} // ✅ directement la nouvelle valeur
                                className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700 bg-white"
                                placeholder="Email..."
                                keyboardType="email-address" // clavier adapté
                                autoCapitalize="none"       // pas de majuscule automatique
                                autoCorrect={false}         // désactive correction auto
                                textContentType="emailAddress" // autofill iOS
                                autoComplete="email"
                            />
                        </View>

                        <View className="flex flex-col justify-center gap-2 w-full">
                            <Text className="text-md font-medium color-white">Mot de passe</Text>
                            <TextInput
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                className="rounded-md px-3 py-2 text-md border border-neutral-300 focus:border-green-500 focus:outline-none text-black placeholder-gray-700  bg-white"
                                placeholder="Mot de passe..."
                            />
                        </View>
                        <View className="w-full flex justify-end">
                            <Pressable
                                className="px-4 py-2 rounded-md bg-green-800 text-white hover:bg-green-700 transition-all w-[40%] self-end text-center"
                                onPress={handleSubmit}
                            >
                                <Text className="color-white">
                                    Se connecter
                                </Text>
                            </Pressable>
                        </View>
                        <View className="w-full justify-center flex mt-4">
                            {/* <Link to="/reset-password" className="absolute bottom-6 text-sm text-white/70 hover:text-white transition">Mot de passe oublié ?</Link> */}
                        </View>
                    </View>
                </View>
            </View>
            {/* <ModalLayout handleModal={handleModal} isOpen={isOpen}>
                <View className="h-12 rounded-md backdrop-blur-sm" style={{ backgroundColor: "hsla(130, 10%, 85%, 0.45)" }}>
                    <View className="bg-red-500 min-h-2 rounded-t-md" />
                    <Text className="px-6 pt-2 pb-4 text-red-50">{errorMessage}</Text>
                </View>
            </ModalLayout> */}
        </>
    )
}
