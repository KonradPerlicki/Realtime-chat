import mongoose from 'mongoose';
import User, { UserInterface } from '../../models/User';
import logger from '../../utils/logger';
import AdminService from './adminService';

export default class UserService extends AdminService {
    public async updateUser(
        id: string,
        data: {
            firstName?: string;
            lastName?: string;
            title?: string;
            description?: string;
            photo?: string;
            backgroundPhoto?: string;
            config?: string;
        }
    ) {
        try {
            return (await User.findByIdAndUpdate(id, data, {
                new: true,
            })) as UserInterface;
        } catch (error: any) {
            logger.error(error.message);
            throw new Error('Something went wrong');
        }
    }

    public async getSuggestionsFor(id: string) {
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(id) },
                },
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    email: 1,
                    photo: 1,
                    title: 1,
                    _id: 1,
                },
            },
            {
                $sample: { size: 3 },
            },
        ]);
        return users;
    }
}
