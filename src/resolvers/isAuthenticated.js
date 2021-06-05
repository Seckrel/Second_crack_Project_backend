import { User } from '../models/models';

export const IsAuthenticated = async ({ req }) => {
    if (!req.userId) return false;
    const user = await User.findById(req.userId).exec();
    if (!user) return false;
    return true;
}