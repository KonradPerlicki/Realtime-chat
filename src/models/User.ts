import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface UserInterface extends Document {
    _id: string;
    username: string;
    email: string;
    password: string | undefined;
    createdAt: Date;
    updatedAt: Date;
    photo: string;
    backgroundPhoto: string;
    googleId: string;
    title: string;
    firstName: string;
    lastName: string;
    description: string;

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
            default: '/assets/images/users/user-dummy-img.jpg',
            set: (filename: string) => {
                if (
                    !filename.includes('http') &&
                    !filename.includes('/assets/images/users/')
                )
                    return '/assets/images/users/' + filename;
                else return filename;
            },
        },
        backgroundPhoto: {
            type: String,
            default: '/assets/images/profile-bg.jpg',
            set: (filename: string) => {
                if (
                    !filename.includes('http') &&
                    !filename.includes('/assets/images/users/')
                )
                    return '/assets/images/users/' + filename;
                else return filename;
            },
        },
        password: {
            type: String,
        },
        title: {
            type: String,
            trim: true,
        },
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
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
