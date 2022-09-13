import { Schema, model, Document } from 'mongoose';

export interface Token extends Document {
    userId: number;
    token: string;
    createdAt: Date;
}

const TokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // expiry time in seconds
    },
});

export default model<Token>('Token', TokenSchema);
