import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    photo: string;
    googleId: string;

    isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
        },
        googleId: {
            type: String,
            unique: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre<UserInterface>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (this.password) {
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;
    }

    return next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export default model<UserInterface>('User', UserSchema);
