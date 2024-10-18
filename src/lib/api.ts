// src/lib/api.ts

import { currentUser } from '@clerk/nextjs/server';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Define interfaces for our data structures
interface User {
    id: string;
    email: string;
    full_name: string;
    avatar?: string;
    preferred_voice?: string;
}

interface Conversation {
    id: string;
    title?: string;
    type: 'human-to-human' | 'human-to-ai';
    participants: string[];
    lastMessageAt?: string;
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    isAiMessage: boolean;
    content: {
        transcription: string;
        audioUrl: string;
        duration: number;
    };
    timestamp: string;
}

interface AudioFile {
    id: string;
    messageId: string;
    userId: string;
    url: string;
    duration: number;
    mimeType: string;
    createdAt: string;
    transcription: string;
}

// Create and configure axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});



export const registerUser = (userData: Omit<User, 'id'>): Promise<AxiosResponse<User>> =>
    api.post('/register', userData);

// Conversation related API calls
export const getConversations = (): Promise<AxiosResponse<Conversation[]>> =>
    api.get('/conversations');

export const getConversation = (conversationId: string): Promise<AxiosResponse<Conversation>> =>
    api.get(`/conversations/${conversationId}`);

export const createConversation = (participants: string[]): Promise<AxiosResponse<Conversation>> =>
    api.post('/conversations', { participants });

export const deleteConversation = (conversationId: string): Promise<AxiosResponse<void>> =>
    api.delete(`/conversations/${conversationId}`);

// Message related API calls
export const getMessages = (conversationId: string): Promise<AxiosResponse<Message[]>> =>
    api.get(`/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<AxiosResponse<Message>> =>
    api.post(`/conversations/${conversationId}/messages`, message);

export const deleteMessage = (conversationId: string, messageId: string): Promise<AxiosResponse<void>> =>
    api.delete(`/conversations/${conversationId}/messages/${messageId}`);

// AI related API calls
export const sendAudioToAI = (conversationId: string, audioBlob: Blob): Promise<AxiosResponse<Message>> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3');
    formData.append('conversation_id', conversationId);

    return api.post('/messages-ai', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getAIResponse = (conversationId: string, messageContent: string): Promise<AxiosResponse<Message>> =>
    api.post(`/conversations/${conversationId}/ai-response`, { message: messageContent });

// Audio file related API calls
export const getAudioFile = (fileId: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/audio/${fileId}`, { responseType: 'blob' });

export const uploadAudioFile = (audioBlob: Blob, metadata: Omit<AudioFile, 'id' | 'url' | 'createdAt'>): Promise<AxiosResponse<AudioFile>> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.mp3');
    Object.keys(metadata).forEach(key => formData.append(key, metadata[key as keyof typeof metadata]));

    return api.post('/audio', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Error handling wrapper
export const apiWrapper = async <T>(apiCall: () => Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await apiCall();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('API Error:', error.response.data);
            throw new Error(error.response.data.message || 'An error occurred');
        }
        console.error('API Error:', error);
        throw error;
    }
};

// Usage example with error handling:
// const data = await apiWrapper(() => getConversations());


/* Register user */
export async function createUser(): Promise<User> {
    const session = await currentUser();

    if (!session) {
        console.error('No current user session');
        throw new Error('User not authenticated');
    }

    try {
        const response = await registerUser({
            email: session.emailAddresses[0].emailAddress,
            full_name: `${session.firstName} ${session.lastName}`.trim(),
            avatar: session.imageUrl,
            preferred_voice: 'alloy' // You can set a default voice or leave it undefined
        });

        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
    }
}

export const getAllUsers = (): Promise<AxiosResponse<User[]>> =>
    api.get('/users');

export const getUserFriends = (userId: string): Promise<AxiosResponse<User[]>> =>
    api.get(`/friends/${userId}`);

export const getUserConversations = (userId: string): Promise<AxiosResponse<Conversation[]>> =>
    api.get(`/users/${userId}/conversations`);


/* Get all users */
export async function fetchAllUsers(): Promise<User[]> {
    try {
        const response = await getAllUsers();
        return response.data;
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users');
    }
}

/* Get user friends */
export async function fetchUserFriends(userId: string): Promise<User[]> {
    try {
        const response = await getUserFriends(userId);
        return response.data;
    } catch (error) {
        console.error('Error fetching user friends:', error);
        throw new Error('Failed to fetch user friends');
    }
}

/* Get user conversations */
export async function fetchUserConversations(userId: string): Promise<Conversation[]> {
    try {
        const response = await getUserConversations(userId);
        return response.data;
    } catch (error) {
        console.error('Error fetching user conversations:', error);
        throw new Error('Failed to fetch user conversations');
    }
}