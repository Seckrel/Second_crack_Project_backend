import { Orders } from "../models/models";

export const PayOrder = async ({ args, req, res }) => {
  try {
    console.log("wlring")
    if (!req.userId) throw new Error("Login to leave a review");
    console.log("payment", args.orderList);
    return { orderCompleted: true };
  } catch (e) {
    console.log("error", e.message);
  }
  return { orderCompleted: true };
};
