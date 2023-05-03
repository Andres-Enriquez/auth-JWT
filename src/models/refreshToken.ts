import { ObjectId } from "bson";

export interface RefreshToken {
    user_id: ObjectId;
    email: string;
    role: string;
    session_id: string;
    token: string;
}