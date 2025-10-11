// In client/src/lib/socket.js
import { io } from "socket.io-client";

let socket;
let onlineUsers = [];
let subscribers = [];

const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...onlineUsers]));
};

export const getSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000', {
            withCredentials: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        // Listen for online users updates
        socket.on('online_users', (users) => {
            onlineUsers = users;
            notifySubscribers();
        });
    }
    return socket;
};

export const subscribeToOnlineUsers = (callback) => {
    if (typeof callback !== 'function') return () => {};
    
    subscribers.push(callback);
    // Immediately invoke with current state
    callback([...onlineUsers]);
    
    // Return unsubscribe function
    return () => {
        subscribers = subscribers.filter(cb => cb !== callback);
    };
};

export const setUserOnline = (userId) => {
    if (socket) {
        socket.emit('user_online', userId);
    }
};