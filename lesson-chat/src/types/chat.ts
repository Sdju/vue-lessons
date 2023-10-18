import type {Message} from '@/types/message';
import type {User} from '@/types/user';

export interface Chat {
    id: string,
    title: string,
    avatar: string,
}

export interface ActiveChat extends Chat {
    messages: Message[],
    users: User[]
}