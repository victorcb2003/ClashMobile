import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "https://clashofleagues.fr/api/tournois"

export const getTournaments = async () => {
    try {
        const response = await axios.get(`${baseUrl}/findAll`);

        return response.data.Tournois;
    } catch (error) {
        console.error("Erreur lors de la récupération des tournois :", error);
        throw error;
    }
};

export const findTournoisById = async (id) => {

    try {
        const response = await axios.get(
            `${baseUrl}/${id}`
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la récupération du tournois :", error);
        throw error;
    }
}

export const createTournois = async (data) => {
    // data = {nom : "nom", date : "YYYY-MM-DD", lieu : "lieu" }

    try {
        const response = await axios.post(
            `${baseUrl}/create`,
            data,
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation du tournois :", error);
        throw error;
    }
}