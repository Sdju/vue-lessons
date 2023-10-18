import {faker} from '@faker-js/faker'
import {WebSocketServer, WebSocket} from 'ws';

const wss = new WebSocketServer({port: 8080});

function createChat() {
  return {
    id: faker.string.uuid(),
    title: faker.internet.domainWord(),
    avatar: faker.image.urlLoremFlickr({category: 'abstract'}),
    messages: [],
    users: {}
  }
}

function createUser() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    avatar: faker.internet.avatar(),
    chats: {}
  };
}

function createMessage({chat, user}) {
  return {
    chat,
    user,
    time: Date.now(),
    id: faker.string.uuid(),
    content: faker.lorem.text()
  }
}

function mapMessageToTransport(message) {
  return {
    chat: message.chat.id,
    user: message.user.id,
    time: message.time,
    id: message.id,
    content: message.content
  }
}

const chats = {}
const users = {}

const methods = {
  newChat() {
    const chat = createChat()
    chats[chat.id] = chat
    return {id: chat.id, success: true}
  },

  getChat({chatId}) {
    const chat = chats[chatId]
    if (!chat) {
      return {success: false, title: `${chatId} not existing`}
    }
    return {
      success: true,
      chat: {
        id: chat.id,
        title: chat.title,
        avatar: chat.avatar,
        messages: chat.messages.slice(-20).map((message) => ({
          chat: message.chat.id,
          user: message.user.id,
          time: message.time,
          id: message.id,
          content: message.content
        })),
        users: Object.entries(chat.users).map(([id, {username, avatar}]) => ({id, username, avatar}))
      }
    }
  },

  newUser() {
    const user = createUser()
    users[user.id] = user
    return {id: user.id}
  },

  addUserToChat({chatId, userId}) {
    const chat = chats[chatId]
    if (!chat) {
      return {success: false, title: 'chat not found'}
    }
    if (userId in chat.users) {
      return {success: false, title: 'user already has been added'}
    }
    const user = users[userId]
    if (!user) {
      return {success: false, title: 'user not found'}
    }
    chat.users[userId] = user

    let nextSpamId = 0

    function spam() {
      nextSpamId = setTimeout(() => {
        const message = createMessage({chat, user})
        chat.messages.push(message)

        const data = mapMessageToTransport(message)

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: 'new-message', data}));
          }
        });

        spam()
      }, Math.random() * 10000 + 500)
    }

    spam()

    user.chats[chatId] = {
      chat,
      stopSpam() {
        clearTimeout(nextSpamId)
      }
    }
    return {success: true}
  },

  removeUserFromChat({chatId, userId}) {
    const chat = chats[chatId]
    if (!chat) {
      return {success: false, title: 'chat not found'}
    }
    if (!(userId in chat.users)) {
      return {success: false, title: 'there is no user in the chat'}
    }
    const user = users[userId]
    if (!user) {
      return {success: false, title: 'user not found'}
    }
    delete chat.users[userId]
    user.chats[chatId].stopSpam()
    delete user.chats[chatId]
    return {success: true}
  },

  listChats() {
    return {
      success: true,
      list: Object.entries(chats).map(([id, {title, avatar}]) => ({id, title, avatar}))
    }
  },

  listUsers() {
    console.log(users)
    return {
      success: true,
      list: Object.entries(users)
        .map(([id, {username, avatar}]) => ({id, username, avatar}))
    }
  }
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(raw) {
    const {data, type, requestId} = JSON.parse(raw)
    const result = {
      type: 'result',
      requestId,
      ...methods[type](data)
    }
    try {
      ws.send(JSON.stringify(result))
    } catch (err) {
      debugger
    }
  });

  ws.send(JSON.stringify({type: 'connected'}))
});

console.log('ws started')