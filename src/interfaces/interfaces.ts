import { ObjectId } from "bson";

export interface ResponseApp {
    ok: boolean;
    message: string;
    result: any;
    error: any;
}

export interface JwtPayload {
    uid: ObjectId;
    session_id: string;
    iat?: number;
    exp?: number
}

