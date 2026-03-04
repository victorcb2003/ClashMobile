import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "https://clashofleagues.fr/api/match"

export const findByTournoisId = async (id) => {

    try {
        const response = await axios.get(
            `${baseUrl}/findByTournoisId/${id.id}`
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération des match du tournois :", error);
        throw error;
    }
}

export const updateMatch = async (data) => {
    // data = {Match_id : Match_id, Equipe1_id : Equipe1_id, Equipe2_id : Equipe2_id, lieu : "lieu", date_heure : "YYYY-MM-DD HH:mm:SS"}
    // au moins 1 élément dans data pas obliger de tout mettre

    try {
        const response = await axios.put(
            `${baseUrl}/update/`,
            data
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la modification du match :", error);
        throw error;
    }
}
export const createMatch = async (data) => {
    // data = {Equipe1_id : Equipe1_id, Equipe2_id : Equipe2_id, lieu : "lieu", date_heure : "YYYY-MM-DD HH:mm:SS"}

    try {
        const response = await axios.post(
            `${baseUrl}/create`,
            data
        );

        console.log(response.data)

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation du match :", error);
        throw error;
    }
}

export const getMatchById = async (id) => {
    try {
        const response = await axios.get(
            `${baseUrl}/${id}`
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération du match :", error);
        throw error;
    }
}


export const findMatchByTournoisId = async (id) => {

    try {
        const response = await axios.get(
            `${baseUrl}/findByTournoisId/${data.id}`
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
}
