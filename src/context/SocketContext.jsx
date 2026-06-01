import {useUser} from "../features/authenication/useUser"
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket";

const SocketContext = createContext(null);

function SocketContextProvider({ children }) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user: currentUser } = useUser();


    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("onlineUsers", (users) => setOnlineUsers(users));

        socket.on("disconnect", () => setIsConnected(false));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("onlineUsers");
        };
    }, []);

    // separate effect — fires when currentUser loads OR socket reconnects
    useEffect(() => {
        if (!currentUser?._id) {
            console.log("currentUser not ready yet:", currentUser);
            return;
        }
        if (!isConnected) {
            console.log("socket not connected yet");
            return;
        }

        console.log("emitting join with:", currentUser._id);
        socket.emit("join", currentUser._id);
    }, [currentUser?._id, isConnected]);

    return (
        <SocketContext.Provider value={{ socket, isConnected, onlineUsers  }}>
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