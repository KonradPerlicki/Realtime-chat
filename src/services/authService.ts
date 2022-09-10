import UserNotFoundException from '../exceptions/userNotFoundException';
import User from '../models/User';
import { createToken } from '../utils/jwt';

export default class AuthService {
    /**
     * Register new user
     */
    public async register(username: string, email: string, password: string) {
        try {
            const createdUser = await User.create({
                username,
                email,
                password,
            });
            const user = createdUser.toObject();
            delete user.password;

            const accessToken = createToken(createdUser, 'access');
            const refreshToken = createToken(createdUser, 'refresh');

            return { accessToken, refreshToken, user };
        } catch (error: any) {
            throw new Error('Unable to register user, ' + error.message);
        }
    }

    public async login(username: string, password: string) {
        const user = await User.findOne({ username });

        if (!user) {
            throw new UserNotFoundException('Invalid username or password');
        }

        if (await user.isValidPassword(password)) {
            const accessToken = createToken(user, 'access');
            const refreshToken = createToken(user, 'refresh');
            return { accessToken, refreshToken, user };
        } else {
            throw new UserNotFoundException('Invalid username or password');
        }
    }
}
