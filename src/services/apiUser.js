import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getUser({ userName }) {
    try {
        const response = await axios.get(`${API_URL}/u/${userName}`, {
        withCredentials: true,
        });
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
}
