import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { Request, Response, NextFunction } from "express";
import User from "../modals/User.js";

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: any; // you can type this more strictly if you have a User type
    }
  }
}

// Define your custom JWT payload type
interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    // Cast to your custom payload
    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as CustomJwtPayload;

    if (!decoded.userId)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
