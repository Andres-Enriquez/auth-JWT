import { Response } from "express";
import { ObjectId } from "bson";
import { v4 as uuidV4 } from "uuid"
import jwt from "jsonwebtoken";
import { JwtPayload, ResponseApp } from "../interfaces/interfaces";
import { setCookie } from "./cookies";
import { database as db } from "../settings/db";
import { Collections as ref } from "../database/collection";
import { responseApp } from "./utils";
import { RefreshToken } from "../models/refreshToken";

interface Props {
    uid: ObjectId;
    email: string;
    role: string;
    res: Response;
}

export const generateToken = async (user: Props): Promise<string> => {
    const { uid, res } = user;
    const sessionId = uuidV4();
    const payload: JwtPayload = { session_id: sessionId, uid }
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN!, { expiresIn: '5m' })
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN!, { expiresIn: '15d' })
    saveRefreshToken(user, sessionId, refreshToken);
    setCookie(accessToken, res);
    return accessToken;
}

export const checkAccessToken = async (token: string): Promise<JwtPayload | ResponseApp> => {
    const payload: JwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN!) as JwtPayload;
    const { uid, session_id } = payload;

    // check if token is blacklisted
    const objSession = await db.getDb().collection(ref.BLACKLIST_TOKEN).
        findOne({ user_id: new ObjectId(uid), session_id });
    if (objSession != null) return responseApp(false, "Token vencido");

    return payload;
}

export const queryRefreshToken = async (decode: JwtPayload): Promise<boolean | RefreshToken> => {
    // Check exists refresh Token
    const objSession = await db.getDb().collection(ref.REFRESH_TOKEN).findOne({ user_id: new ObjectId(decode.uid), session_id: decode.session_id });
    if (objSession == null) {
        return false;
    }

    const oldRefrToken: RefreshToken = {
        user_id: objSession['user_id'],
        email: objSession['email'],
        role: objSession['role'],
        session_id: objSession['session_id'],
        token: objSession['token']
    };

    const { session_id, user_id } = oldRefrToken;

    // Check credential valid of user
    if (decode.session_id != session_id && decode.uid != user_id) return false;

    return oldRefrToken;
}

export const saveRefreshToken = async (user: Props, sessionId: string, token: string) => {
    const refreshToken: RefreshToken = { user_id: user.uid, email: user.email, role: user.role, session_id: sessionId, token };
    await db.getDb().collection(ref.REFRESH_TOKEN).insertOne(refreshToken);
}

