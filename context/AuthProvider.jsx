import { createContext ,useEffect, useState, useContext } from "react"
import { login,logout,getUser } from "../services/authService"

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user,setUser] = useState(null)
    const [match, setMatch] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAdmin,setIsAdmin] = useState(false)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    useEffect(()=>{
        fetchUser()
    },[])

    useEffect(()=>{
        setIsAdmin(user?.type == "Admin")
        setIsAuthenticated(user != null)
    },[user])

    async function fetchUser() {
        try {
            const result = await getUser()

            if (result) {
                setUser(result?.user[0] || null)
                setMatch(result?.match || null)
            } else {
                setUser(null)
                setMatch(null)
            }
            return result
        } catch(err){
            console.log(`fetchUser : ${err}`)
            setUser(null)
            setMatch(null)
            throw err
        } finally {
            setIsAuthLoading(false)
        }

    }

    async function authLogin(data){
        try{
            const result = await login(data)
            await fetchUser()

            return result
        } catch(err){
            console.log(`authLogin : ${err}`)
            throw err
        }
    }

    async function authLogout() {
        await logout()
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, match, isAdmin, isAuthenticated, isAuthLoading, authLogin, fetchUser, authLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);