// src/hooks/useWebSockets.ts
"use client";
import { useState, useEffect, useCallback } from 'react';

interface WebSocketHook {
    sendMessage: (message: string) => void;
    lastMessage: string | null;
    readyState: number;
}

const useWebSockets = (url: string): WebSocketHook => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => setReadyState(WebSocket.OPEN);
        ws.onclose = () => setReadyState(WebSocket.CLOSED);
        ws.onerror = (error) => console.error('WebSocket error:', error);
        ws.onmessage = (event) => setLastMessage(event.data);

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [url]);

    const sendMessage = useCallback(
        (message: string) => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            } else {
                console.error('WebSocket is not connected');
            }
        },
        [socket]
    );

    return { sendMessage, lastMessage, readyState };
};

export default useWebSockets;