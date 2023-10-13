import {computed, reactive, ref} from 'vue';
import {defineStore} from 'pinia';
import {useRoute} from 'vue-router';
import type {Channel} from '@/types';

export interface Message {
    id: number;
    author: number;
    time: number;
    content: string;
    completed: boolean;
    error?: string;
}

let id = 0
function createMessage(text?: string, completed = false): Message {
    return {
        author: 0,
        content: text ?? Math.random().toString(),
        time: Date.now(),
        id: id++,
        completed
    }
}

function createChannel(): Channel {
    return {
        id: String(id++),
        messages: Array.from({ length: 5 }, () => createMessage(undefined, true))
    }
}

export const useChat = defineStore('chat', () => {
    const route = useRoute()

    const channels = ref<Channel[]>(
        Array.from({ length: 5 }, () => createChannel())
    )
    const activeChannel = computed(() => {
        const paramId = route.meta.chatParamId
        if (!paramId) {
            return undefined
        }
        return channels.value.find(channel => channel.id === route.params?.[paramId])
    })

    const messages = computed(() => activeChannel.value?.messages || [])

    async function addMessage(text?: string): Promise<{ success: boolean; value: unknown }> {
        let message: Message | null = null
        let tries = 5
        let value = null
        let success = false

        message = reactive(createMessage(text))
        messages.value.push(message)

        while (tries) {
            try {
                await new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.1 ? reject : resolve, 200)
                })
                console.log(`success ${message.id} (${tries} tries)`)

                value = message.id
                message.completed = true
                success = true
                break;
            } catch (e) {
                value = e
                tries -= 1;
                console.log(`fail ${message.id} (${tries} tries)`)

                if (tries === 0) {
                    message.error = 'Network Error'
                }
            }
        }

        return { success, value }
    }

    return {
        channels,
        activeChannel,
        messages,
        addMessage
    }
})
