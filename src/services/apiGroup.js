import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

export async function addMembers({ groupId, memberIds }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/add`,
            { memberIds },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to add members", { cause: error });
    }
}

export async function removeMember({ groupId, memberIds }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/remove`,
            { memberIds },
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to remove members", { cause: error });
    }
}

export async function leaveGroup({ groupId }) {
    try {
        const response = await axios.post(
            `${API_URL}/groups/${groupId}/leave`,
            {},
            { withCredentials: true }
        );
        return response.data.data;
    } catch (error) {
        console.log(error.response?.data);
        throw new Error(error.response?.data?.message || "Failed to leave group", { cause: error });
    }
}
