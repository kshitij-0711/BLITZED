import { UserDocument } from "../../modals/User"; // Adjust the import based on your actual User model

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // or the correct type of your user object
    }
  }
}
