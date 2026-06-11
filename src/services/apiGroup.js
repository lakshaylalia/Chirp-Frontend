import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a new group
export async function createGroup(formData) {
    try {
        const response = await axios.post(
            `${API_URL}/groups`,
            formData,
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to create group", { cause: error });
    }
}

// Get a specific group (details)
export async function getGroup({ groupId }) {
    try {
        const response = await axios.get(`${API_URL}/groups/info/${groupId}`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to get group", { cause: error });
    }
}

// Get all groups for the current user
export async function getUserGroups() {
    try {
        const response = await axios.get(`${API_URL}/groups`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to get groups", { cause: error });
    }
}

// Delete a group
export async function deleteGroup({ groupId }) {
    try {
        const response = await axios.delete(`${API_URL}/groups/${groupId}`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to delete group", { cause: error });
    }
}

// Update group (name, avatar)
export async function updateGroup({ groupId, formData }) {
    try {
        const response = await axios.patch(
            `${API_URL}/groups/${groupId}`,
            formData,
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to update group", { cause: error });
    }
}

// Add members to a group
export async function addMembers({ groupId, memberIds }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/add`,
            { userId: memberIds[0] },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to add members", { cause: error });
    }
}

// Remove a member from a group
export async function removeMember({ groupId, memberIds }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/remove`,
            { userId: memberIds[0] },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to remove members", { cause: error });
    }
}

// Leave a group (same as removeMember but for self)
export async function leaveGroup({ groupId }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/remove`,
            {},
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to leave group", { cause: error });
    }
}

// Get group messages
export async function getGroupMessages({ groupId }) {
    try {
        const response = await axios.get(`${API_URL}/groups/${groupId}/messages`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to get group messages", { cause: error });
    }
}

// Send group message
export async function sendGroupMessage({ groupId, message }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/messages`,
            { message },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to send message", { cause: error });
    }
}

// Delete group message
export async function deleteGroupMessage({ groupId, messageId }) {
    try {
        const response = await axios.delete(`${API_URL}/groups/${groupId}/messages/${messageId}`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to delete message", { cause: error });
    }
}
