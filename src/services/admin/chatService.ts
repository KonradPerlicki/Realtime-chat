import mongoose from 'mongoose';
import Conversation, { ConversationInterface } from '../../models/Conversation';
import Message from '../../models/Message';
import User from '../../models/User';
import Socket from '../../utils/socket';
import AdminService from './adminService';

interface SocketSendMessage {
    msg: string;
    userId: string;
}

interface SocketUsers {
    userID: string;
    userDbId: string;
}

export default class ChatService extends AdminService {
    private socket: Socket;

    public constructor() {
        super();
        this.socket = new Socket();
        this.socket.io.use((socket, next) => {
            const userId = socket.handshake.auth.userId as string;
            if (!userId) return next(new Error('User Id missing.'));

            (socket as any).userId = userId;
            next();
        });
        this.socket.io.on('connection', (socket) => {
            //create rooms with user id from DB
            socket.join((socket as any).userId);

            socket.on('send-message', (data: SocketSendMessage) => {
                this.socket.io
                    .to(data.userId)
                    .emit('receive-message', data.msg);
            });
        });
    }

    public async sendMessage(from: string, to: string, message: string) {
        const conversation =
            (await Conversation.findOne({
                $or: [
                    { user1: from, user2: to },
                    { user1: to, user2: from },
                ],
            })) ||
            (await Conversation.create({
                user1: from,
                user2: to,
            }));

        await Message.create({
            senderId: from,
            receiverId: to,
            text: message,
            conversationId: conversation._id,
        });
    }

    public async getConversationsWith(
        userId: string
    ): Promise<ConversationInterface[]> {
        let conversations = await Conversation.aggregate([
            {
                $match: {
                    $or: [
                        { user1: new mongoose.Types.ObjectId(userId) },
                        { user2: new mongoose.Types.ObjectId(userId) },
                    ],
                },
            },
        ]);

        conversations = await Promise.all(
            conversations.map(async (conv) => {
                const conversationUser =
                    userId === conv.user1.toString() ? conv.user2 : conv.user1;
                conv.userInfo = await User.findById(conversationUser, {
                    username: 1,
                    photo: 1,
                    email: 1,
                });
                return conv;
            })
        );

        return conversations;
    }

    public async getMessages(from: string, to: string, offset: string) {
        const messages = await Message.find(
            {
                $or: [
                    { senderId: from, receiverId: to },
                    { senderId: to, receiverId: from },
                ],
            },
            { createdAt: 1, text: 1, _id: 1, senderId: 1 }
        )
            .sort({ createdAt: -1 })
            .lean()
            .skip(Number(offset))
            .limit(15);

        messages.map((msg) => {
            if (msg.senderId.toString() === from) {
                msg.owner = true;
            }
            return msg;
        });
        const reversedMessages = messages.reverse();

        return reversedMessages;
    }
}
