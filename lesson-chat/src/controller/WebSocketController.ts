import type {Message} from '@/types/message';

type PromiseCallback = (value: unknown) => void

export const WebSocketController = {
    ws: null as null | WebSocket,

    pendingRequests: new Map<string, { resolve: PromiseCallback, reject: PromiseCallback }>(),

    messageReceiver: null as null | ((msg: Message) => void),

    methods: {
        result: (data: unknown) => {
            WebSocketController.pendingRequests.get(data.requestId).resolve(data)
        },

        connected() {
            console.log('WS CONNECTED')
        },

        'new-message'({ data }) {
            WebSocketController.messageReceiver?.(data as Message)
        }
    },

    init: function () {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(`ws://${location.host}/ws`)

                this.ws.addEventListener('open', () => {
                    resolve()
                })

                this.ws.addEventListener('close', () => {

                })

                this.ws.addEventListener('message', (message) => {
                    try {
                        const received = JSON.parse(message.data)

                        const method = received.type as keyof typeof this['methods']
                        if (!this.methods[method]) {
                            throw new Error(`there is no websocket controller method ${method}`)
                        }
                        this.methods[method](received)
                    } catch (err) {
                        console.error(err)
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    },

    request: function (type: string, data?: unknown) {
        return new Promise((resolve, reject) => {
            const message = {
                requestId: crypto.randomUUID(),
                data,
                type
            }

            if (!this.ws) {
                return reject(new Error('No websocket connection'))
            }

            this.ws.send(JSON.stringify(message))
            this.pendingRequests.set(message.requestId, {
                resolve: (data) => {
                    this.pendingRequests.delete(message.requestId)
                    resolve(data)
                },
                reject: () => {
                    this.pendingRequests.delete(message.requestId)
                    reject(data)
                }
            })
        })
    }
}

window.wsController = WebSocketController
