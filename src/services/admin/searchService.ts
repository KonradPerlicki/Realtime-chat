import { Request } from 'express';
import User, { UserInterface } from '../../models/User';

export default class SearchService {
    public async search(req: Request<{}, {}, {}, { q: string }>) {
        const { q: searchQ } = req.query;
        const regex = new RegExp(searchQ, 'i');
        const user = req.user as UserInterface;

        const data = await User.find(
            {
                $and: [
                    { $or: [{ username: regex }, { email: regex }] },
                    { _id: { $ne: user.id } },
                ],
            },
            {
                email: 1,
                username: 1,
                _id: 1,
                photo: 1,
            }
        ).limit(10);
        return data;
    }
}
