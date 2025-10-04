import { NextFunction, Request, Response } from "express";
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from '@arcjet/inspect';

export const arcjetProtection = async (req:Request, res:Response, next:NextFunction) => {
  try {
        // Bypass Arcjet locally
    if (process.env.NODE_ENV === "development") {
      return next();
    }

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }

    // check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot activity detected.",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};
