import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getMessages(friendId, isGroup = false) {
    try {
        const url = isGroup
            ? `${API_URL}/groups/${friendId}/messages`
            : `${API_URL}/messages/${friendId}`;
        const response = await axios.get(url, {
            withCredentials: true,
        });

        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to get messages", { cause: error });
    }
}

export async function sendMessage({ receiverId, message, imageFile }) {
    try {
        const formData = new FormData();
        formData.append("receiverId", receiverId);
        if (message) formData.append("message", message);
        if (imageFile) formData.append("image", imageFile);

        const response = await axios.post(
            `${API_URL}/messages`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response.data);
        throw new Error(error.response.data.message, { cause: error });
    }
}

export async function sendGroupMessage({ groupId, message }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/messages`,
            { message },
            { withCredentials: true }
        );
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to send message", { cause: error });
    }
}

export async function deleteMessage({ messageId }) {
    try {
        const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to delete message", { cause: error });
    }
}
