import axios from "axios";
axios.defaults.withCredentials = true;
const baseUrl = "https://clashofleagues.fr/api/equipe"


export const createEquipe = async (data) => {
    // data = {nom : "nom"}
    try {
        const response = await axios.post(
            `${baseUrl}/create`,
            data
        );

        return response;
    } catch (error) {
        console.error("Erreur lors de la creation de l'equipe :", error);
        throw error;
    }
};

export const renameEquipe = async (data) => {
    // data = {Equipe_id : "Equipe_id",nom : "nom"}
    try {
        const response = await axios.put(
            `${baseUrl}/rename`,
            data
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const deleteEquipe = async (data) => {
    // data = {Equipe_id : "Equipe_id"}
    try {
        const response = await axios.delete(
            `${baseUrl}/delete`,
            {data
            }
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const findAllEquipe = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}/findAll`
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const getEquipeById = async (id) => {
    try {
        return (await axios.get(`${baseUrl}/${id}`)).data
    } catch (err) {
        console.log(err)
    }

}

export const infoEquipe = async (data) => {
    //data {Equipe_id : Equipe_id }
    try {
        const response = await axios.get(
            `${baseUrl}/${data.Equipe_id}`
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const addjoueurEquipe = async (data) => {
    //data {Equipe_id : Equipe_id, Joueur_id : "Joueur_id" }
    try {
        const response = await axios.post(
            `${baseUrl}/addJoueur`, 
            data
        );

        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
};

export const findAllJoueur = async (data) =>{
    
    try{
        const response = await axios.get(
            `https://clashofleagues.fr/api/joueur/findAll`
        )

        return response.data;
    }
    catch(err){
        console.error(err.error)
    }
}

export const removejoueurEquipe = async (data) => {
    //data {Equipe_id : Equipe_id, Joueur_id : "Joueur_id" }
    try {
        const response = await axios.delete(
            `${baseUrl}/removeJoueur`, 
            {data}
        );

        return response.data;
    } catch (error) {
        console.error(
            "Erreur lors du changement du nom de l'equipe :",
            error.message,
        );
        throw error;
    }
};

export const equipeMe = async () => {
    try {
        const response = await axios.get(
            `${baseUrl}/me`
        );
        return response.data;
    } catch (error) {
        console.error("Erreur lors du changement du nom de l'equipe :", error);
        throw error;
    }
}

export const deleteImage = async (id) =>{
    try {
        const response = await axios.delete(
            `${baseUrl}/image/${id}`
        );
        return response.data;
    } catch (err) {
        console.error("Erreur lors de la suppression de l'image de l'equipe :",err)
        throw err
    }
}

export const postImage = async (data) =>{
    try {
        const response = await axios.post(
            `${baseUrl}/image/${data.id}`, data.imageFile
        );
        return response.data;
    } catch (err) {
        console.error("Erreur lors de la suppression de l'image de l'equipe :",err)
        throw err
    }
}
