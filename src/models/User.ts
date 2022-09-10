import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;

    isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
        },
    },
    { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    return next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export default model<User>('User', UserSchema);
