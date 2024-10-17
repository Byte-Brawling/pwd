// src/types/index.d.ts
declare module '*.json' {
    const value: any;
    export default value;
}

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messages: Message[];
}

interface Message {
    id: string;
    conversationId: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
}

interface VoiceAssistantConfig {
    wakeWord: string;
    language: string;
    voice: string;
}

interface AnalysisResult {
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    entities: Array<{
        name: string;
        type: string;
    }>;
}

interface WebPageAnalysis {
    url: string;
    title: string;
    description: string;
    mainContent: string;
    images: Array<{
        url: string;
        alt: string;
        analysis: AnalysisResult;
    }>;
}