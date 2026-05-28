import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getMessages(friendId) {
    try {
        const response = await axios.get(`${API_URL}}/messages/${friendId}`, {
        withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
}

export async function sendMessage({ receiverId, message }) {
    try {
        const response = await axios.post(
        `${API_URL}/messages/send`,
        {
            receiverId,
            message,
        },
        { withCredentials: true },
        );
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
}
