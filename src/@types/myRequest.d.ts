import { UserResponse } from "./UserInfo";

declare global {
     namespace Express {
         interface Request {
            user?: UserResponse;
         }
     }
}