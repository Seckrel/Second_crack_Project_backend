import { User } from '../models/models';
import hash from 'object-hash';
import { createTokens } from '../auth';

export const LoginUser = async ({ userName, password, res }) => {
    const responseValue = {
        flag: false,
        errors: null,
        msg: null
    }
    try {
        const user = await User.findOne({ userName: userName })
        if (!user) throw new Error("User doesn't exist");
        const checkPassword = hash(password) === user.password;
        if (!checkPassword) throw new Error("Either Username or password doesn't match");
        const { refreshToken, accessToken } = createTokens(user)
        res.cookie('access-token', accessToken, { maxAge: 60 * 1000, httpOnly: true, secure: true, sameSite: false});
        res.cookie('refresh-token', refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,  secure: true, sameSite: false});
        res.status(200)
        responseValue.flag = true
        responseValue.msg = `Welcome Back ${userName}!`
        console.log(new Date().toLocaleTimeString(), "--> login success")
    } catch (err) {
         console.log("err: ",err)
        responseValue.error = err.message;
    }
    return responseValue;
}