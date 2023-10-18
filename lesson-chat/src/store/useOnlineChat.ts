import {defineStore} from 'pinia';
import {WebSocketController} from '@/controller/WebSocketController';
import {computed, ref, watchEffect} from 'vue';
import type {User} from '@/types/user';
import type {ActiveChat, Chat} from '@/types/chat';
import type {Message} from '@/types/message';

export const useOnlineChat = defineStore('oneline-chat', () => {
    const users = ref<User[]>([])
    const chats = ref<Chat[]>([])

    const activeChat = ref<ActiveChat | null>(null)

    WebSocketController.init().then(() => {
        listChats()
        listUsers()
    })

    async function newUser() {
        await WebSocketController.request('newUser')
        await listUsers()
    }

    async function listUsers() {
        users.value = (await WebSocketController.request('listUsers')).list
    }

    async function newChat() {
        await WebSocketController.request('newChat')
        await listChats()
    }

    async function listChats() {
        chats.value = (await WebSocketController.request('listChats')).list
    }

    async function setActiveChat(chatId: string) {
        const result = await WebSocketController.request('getChat', {chatId})

        if (!result.success) {
            throw new Error(`setActiveChat error: ${result.title}`)
        }
        activeChat.value = result.chat
    }

    async function addUserToChat(chatId: string, userId: string) {
        const result = await WebSocketController.request('addUserToChat', {chatId, userId})

        if (!result.success) {
            throw new Error(`setActiveChat error: ${result.title}`)
        }
        await setActiveChat(chatId)
    }

    function receiver(message: Message) {
        if (message.chat !== activeChat.value?.id) {
            return
        }
        activeChat.value.messages.push(message)
    }


    watchEffect(() => {
        WebSocketController.messageReceiver = activeChat.value
            ? receiver
            : null
    })

    return {
        users,
        chats,
        activeChat,
        newUser,
        newChat,
        listUsers,
        listChats,
        setActiveChat,
        addUserToChat,
    }
})
