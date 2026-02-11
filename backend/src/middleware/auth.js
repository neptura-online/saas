import jwt from "jsonwebtoken";
import { User } from "../modules/User.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json("Token missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json("Token missing");
    }
    if (!process.env.KEY) {
      throw new Error("JWT secret missing");
    }

    const decoded = jwt.verify(token, process.env.KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json("Token expired");
    }
    return res.status(401).json("Invalid token");
  }
};
