import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../modals/User.js";
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        // Cast to your custom payload
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded.userId)
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        const user = await User.findById(decoded.userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
