import { useEffect, useState } from "react"
import { View } from "react-native"
import {getUser} from "../services/authService"

export default function Footer() {
    const [menuItem,setMenuItem] = useState([])
    const [user,setUser] = useState(null)

    useEffect(()=>{
        (async ()=>{
            console.log(getUser)
            const user = await getUser()
            console.log(user)
        })()
    })

  return (
    <View>

    </View>
  )
}
