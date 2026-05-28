import { io } from "socket.io-client";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const socket = io(`${VITE_SERVER_URL}`, {
    withCredentials: true,
})