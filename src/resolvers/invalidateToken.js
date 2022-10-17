import { User } from "../models/models";

export const InvalidateToken = async ({ req, res }) => {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");
  console.log("cleared", req.userId);
  const responseValue = {
    flag: false,
    error: null,
  };
  try {
    if (!req.userId) throw new Error("Already logged out");
    const user = await User.findById(req.userId);
    if (!user) throw new Error("Already logged out");
    user.count += 1;
    await user.save();
    responseValue.flag = true;
    console.log(new Date().toLocaleTimeString(), "--> logout success");
  } catch (err) {
    responseValue.error = err.message;
  }
  return responseValue;
};
