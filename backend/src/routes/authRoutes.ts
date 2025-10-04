import express from "express";
import { arcjetProtection } from '../middlewares/arcjetMiddleware.js';
import { signup, login, logout, updateProfile } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddlewares.js';

const authRouter = express.Router();

authRouter.use(arcjetProtection);

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.put("/update-profile", protectRoute, updateProfile);
authRouter.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default authRouter;