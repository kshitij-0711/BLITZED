import jwt, { JwtPayload } from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";
import { ENV } from "../lib/env.js";
import User, { IUser } from "../modals/User.js";

// Extend the Socket interface to include custom properties
export interface AuthenticatedSocket extends Socket {
  userId: string;
  user: IUser;
}

// Define the JWT payload structure
interface DecodedToken extends JwtPayload {
  userId: string;
}

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
): Promise<void> => {
  try {
    // extract token from http-only cookies
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    if (!ENV.JWT_SECRET) {
      console.log("Socket connection rejected: JWT secret not configured");
      return next(new Error("Server configuration error"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as DecodedToken;
    
    if (!decoded || !decoded.userId) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user from db
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user info to socket
    const authenticatedSocket = socket as AuthenticatedSocket;
    authenticatedSocket.user = user;
    authenticatedSocket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.log("Error in socket authentication:", errorMessage);
    next(new Error("Unauthorized - Authentication failed"));
  }
};