import { sign } from "jsonwebtoken";
require("dotenv").config();

export const createTokens = (user) => {
  const refreshToken = sign(
    { userId: user._id, count: user.count },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  const accessToken = sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "15s",
  });
  return { refreshToken, accessToken };
};
