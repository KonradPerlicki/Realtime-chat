import { Schema, model, Document, Types } from 'mongoose';

export interface ConversationInterface extends Document {
    user1: string;
    user2: string;
    userInfo?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        photo: string;
    };

    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema(
    {
        user1: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        user2: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    { timestamps: true }
);

ConversationSchema.virtual('userInfo');

export default model<ConversationInterface>('Conversation', ConversationSchema);
