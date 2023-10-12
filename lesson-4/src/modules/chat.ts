import {ref} from 'vue';
import type {Message} from '@/types';

let id = 0
function createMessage(): Message {
    return {
        author: 0,
        content: Math.random().toString(),
        time: Date.now(),
        id: id++,
        completed: false
    }
}

const messages = ref<Message[]>(
    Array.from({ length: 5 }, createMessage)
)

export function useChat() {
    return {
        messages,
        addMessage() {
            messages.value.push(createMessage())
        }
    }
}
