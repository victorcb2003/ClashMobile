const baseUrl = "https://clashofleagues.fr/api/but"
import axios from "axios";

export const createBut = async (data) => {
    try {
        return (await axios.post(`${baseUrl}/create/`,
            data
        )).data
    } catch (err) {
        return err
    }
}

export const getButById = async (id) => {
    try {
        return (await axios.get(`${baseUrl}/${id}`)).data
    } catch (err) {
        console.log(err)
    }

}

export const deleteBut = async (id) => {
    try {
        return (await axios.delete(`${baseUrl}/delete/${id}`)).data
    } catch (err) {
        console.log(err)
    }

}

export const updateBut = async (data) => {
    try {
        return (await axios.put(`${baseUrl}/update`,
            data
        )).data
    } catch (err) {
        console.log(err)
    }

}

export const getButByMatch = async (id) => {
    try {
        return (await axios.get(`${baseUrl}/findAllByMatch/${id}`)).data
    } catch (err) {
        console.log(err)
    }
}
