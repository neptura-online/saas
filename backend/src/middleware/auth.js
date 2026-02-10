import jwt from "jsonwebtoken";
import { User } from "../modules/User.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json("Token missing");
    }

    const decoded = jwt.verify(token, process.env.KEY);

    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json("Invalid or expired token");
  }
};
