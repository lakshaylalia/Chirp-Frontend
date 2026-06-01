import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCurrentUser() {
    try {
        const response = await axios.get(`${API_URL}/user`, {
        withCredentials: true,
        });
        console.log(await response.data.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
}

export async function searchUser({ userName }) {
    try {
        const response = await axios.get(`${API_URL}/user/search/${userName}`, {
        withCredentials: true,
        });
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
};

export async function getUser({userName}) {
        try {
        const response = await axios.get(`${API_URL}/user/${userName}`, {
        withCredentials: true,
        });
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
};

export async function updateUser({ displayName, avatarImage, bio }) {
    try {
        const response = await axios.put(
            `${API_URL}/user`,
            { displayName, avatarImage, bio },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
};