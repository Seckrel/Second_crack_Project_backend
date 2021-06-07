import { User } from '../models/models';
import hash from 'object-hash';

export const AddUser = async (args) => {
    const responseValue = {
        flag: false,
        msg: null,
        error: null
    }
    console.log("trying to add");
    try {
        const { userName, password, firstName, lastName, phnNumber } = args
        const exist = await User.exists({ userName: userName })
        if (exist) throw new Error("User already exit");
        const hashed_password = hash(password)
        console.log(hashed_password)
        User.create({
            userName: userName,
            password: hashed_password,
            firstName: firstName,
            lastName: lastName,
            phnNumber: phnNumber?phnNumber:null
        });
        responseValue.msg = `Hello ${userName}! Welcome to 2nd Crack`;
        responseValue.flag = true
    } catch (e) {
        console.error("Adding new User ", e)
        responseValue.error = e.message;
    }
    return responseValue;
}
