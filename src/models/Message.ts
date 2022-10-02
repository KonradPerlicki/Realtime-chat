import { Schema, model, Document } from 'mongoose';

export interface MessageInterface extends Document {
    senderId: string;
    receiverId: string;
    text?: string;
    conversationId: string;

    owner?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            trim: true,
        },
        conversationId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Conversation',
        },
    },
    { timestamps: true }
);

MessageSchema.virtual('owner');

export default model<MessageInterface>('Message', MessageSchema);
