const baseUrl = "https://clashofleagues.fr/api/message"
import axios from "axios"
axios.defaults.withCredentials = true

export const findAllMessage = async () =>{
    try {
        return (await axios.get(`${baseUrl}/findAll`)).data.messages
    } catch (err){
        console.log(err.error)
    }
}

export const sendMessage = async (data) => {
    try {
        return (await axios.post(`${baseUrl}/create`, data)).data
    } catch (err) {
        console.log(err.error)
        throw err
    }
}

export const deleteMessage = async (id) => {
    try {
        return (await axios.delete(`${baseUrl}/delete/${id}`)).data
    } catch (err) {
        console.log(err.error)
        throw err
    }
}