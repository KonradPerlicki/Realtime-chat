import UserNotFoundException from '../../exceptions/userNotFoundException';
import User from '../../models/User';

export default class UserService {
    public async userProfile(id: string) {
        const user = await User.findById(id);
        if (!user) {
            throw new UserNotFoundException('This user does not exist');
        }
        return user;
    }
}
