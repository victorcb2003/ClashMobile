import { useEffect, useState } from "react"
import { View } from "react-native"
import {getUser} from "../services/authService"

export default function Footer() {
    const [menuItem,setMenuItem] = useState([])
    const [user,setUser] = useState(null)

    useEffect(()=>{
        (async ()=>{
            const user = await getUser()
        })()
    },[])

  return (
    <View className="absolute bottom-0 w-full h-10 bg-green-500">

    </View>
  )
}
