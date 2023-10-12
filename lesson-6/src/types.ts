export interface Message {
    id: number;
    author: number;
    time: number;
    content: string;
    completed: boolean;
    error?: string;
}

export interface Channel {
    id: string;
    messages: Message[]
}