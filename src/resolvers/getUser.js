import { User } from '../models/models';

export const GetUser = async (userId) => {
    if (!userId) return { error: "No user found" }
    try {
        const user = User.findById(userId).exec();
        if (!user) throw new Error("User has been disabled");
        return user;
    } catch (err) {
        return { error: err.message }
    }

}