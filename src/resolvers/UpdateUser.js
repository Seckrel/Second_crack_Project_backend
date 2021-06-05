import { User } from '../models/models';
import hash from 'object-hash';


export const UpdateUser = async (args, req) => {
    const respVal = {
        userName: "",
        firstName: "",
        lastName: "",
        phnNumber: "",
        error: "",
    }
    try {
        if (!req.userId) throw new Error("User not logged in");
        const user = await User.findById(req.userId).exec();
        if (args.newPassword && args.currentPassword) {
            const hashedCurrentPassword = hash(args.currentPassword);
            if (hashedCurrentPassword !== user.password) throw new Error("Password does not match");
            const hashedNewPassword = hash(args.newPassword);
            user.password = hashedNewPassword;
        }
        user.firstName = args.firstName;
        user.lastName = args.lastName;
        user.phnNumber = args.phnNumber;
        await user.save();
    } catch (e) {
        console.log(e.message)
        respVal.error = e.message
        resp.userName = args.userName;
        resp.firstName = args.firstName
    }
    return respVal;
}

