// SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket";

const SocketContext = createContext(null);

function SocketContextProvider({ children }) {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
        {children}
        </SocketContext.Provider>
    );
}

function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
}

export { SocketContextProvider, useSocket };
