import {useUser} from "../features/authenication/useUser"
import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../services/socket";

const SocketContext = createContext(null);

function SocketContextProvider({ children }) {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState({}); // { chatId: { userId: true } }
    const { user: currentUser } = useUser();


    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("onlineUsers", (users) => setOnlineUsers(users));

        socket.on("disconnect", () => setIsConnected(false));

        // Handle typing indicators
        socket.on("userTyping", ({ senderId, isTyping }) => {
            setTypingUsers((prev) => ({
                ...prev,
                [senderId]: isTyping,
            }));
        });

        socket.on("groupTyping", ({ groupId, senderId, isTyping }) => {
            setTypingUsers((prev) => {
                const groupTyping = prev[groupId] || {};
                const updated = { ...prev };
                if (isTyping) {
                    updated[groupId] = { ...groupTyping, [senderId]: true };
                } else {
                    const { [senderId]: _, ...rest } = groupTyping;
                    updated[groupId] = rest;
                }
                return updated;
            });
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("onlineUsers");
            socket.off("userTyping");
            socket.off("groupTyping");
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

    const emitTyping = (receiverId, isTyping) => {
        socket.emit("typing", { receiverId, isTyping });
    };

    const emitGroupTyping = (groupId, isTyping) => {
        socket.emit("typingGroup", { groupId, isTyping });
    };

    const isUserTyping = (chatId) => typingUsers[chatId] && Object.keys(typingUsers[chatId]).length > 0;

    return (
        <SocketContext.Provider value={{ socket, isConnected, onlineUsers, emitTyping, emitGroupTyping, isUserTyping }}>
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