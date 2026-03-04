const baseUrl = "https://clashofleagues.fr/api"
import axios from "axios"
axios.defaults.withCredentials = true

export const getUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/user/me`)
        console.log(response)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération du user :", error)
    }
}

export const formSignUp = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/form`, data)

        return response.data
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire user :", error)
        throw error
    }
}

export const login = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/user/login`, data)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la connexion :", error)
        throw error
    }
}

export const logout = async () => {
    try {
        const response = await axios.get(`${baseUrl}/user/logout`)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération du user :", error)
        throw error
    }
}

export const infoUser = async (id) => {
    try {
        return (await axios.get(`${baseUrl}/user/${id}`)).data.user[0]
    } catch(err){
        console.error(err.error)
    }
}

export const searchUser = async (searchTerm) => {
    try {
        return (await axios.get(`${baseUrl}/user/search/${searchTerm}`)).data
    } catch(err){
        console.error(err.error)
    }
}
export const confirmMail = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/form/confirm`, {token: data.token, password: data.password})

        return response.data
    } catch (error) {
        console.error("Erreur lors de la confirmation du mail", error)
        throw error
    }
}

export const setImageProfil = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/user/image/${data.id}`, data.imageFile)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la confirmation du mail", error)
        throw error
    }
}

export const deleteImageProfil = async (data) => {
    try {
        const response = await axios.delete(`${baseUrl}/user/image/${data.id}`)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la confirmation du mail", error)
        throw error
    }
}

export const updateUser = async (data) => {
    // data = {id : id, nom : nom, prenom : prenom, email : email}
    try {
        const response = await axios.put(`${baseUrl}/user/update/${data.id}`, data)

        return response.data
    } catch (error) {
        console.error("Erreur lors de la confirmation du mail", error)
        throw error
    }
}

export const changePassword = async (data) => {
    // data = {id : id, currentPassword : currentPassword, newPassword : newPassword}
    try {
        const response = await axios.put(`${baseUrl}/user/changePassword/${data.id}`, {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        })

        return response.data
    } catch (error) {
        console.error("Erreur lors du changement de mot de passe", error)
        throw error
    }
}

export const getVerif = async () => {
    try {
        const response = await axios.get(`${baseUrl}/user/verif`)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération des vérifications", error)
        throw error
    }
}

export const putVerif = async (data) => {
    try {
        const response = await axios.put(`${baseUrl}/user/verif`, {
            id: data.id,
            value: data.value
        })
        return response.data
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la vérification", error)
        throw error
    }
}

export const resetPassword = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/form/reset-password`, {
            email: data.email
        })
        return response.data
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe", error)
        throw error
    }
}

export const confirmResetPassword = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/form/confirm-reset-password`, {
            token: data.token,
            password: data.password
        })
        return response.data
    } catch (error) {
        console.error("Erreur lors de la confirmation de la réinitialisation du mot de passe", error)
        throw error
    }
}
