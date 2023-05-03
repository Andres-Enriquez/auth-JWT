import { Response, Request } from "express";
import { ObjectId } from "bson";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/interfaces";
import { generateToken, queryRefreshToken } from "../helpers/tokens";
import { Collections as ref } from "../database/collection";
import { database as db } from "../settings/db";
import { responseApp } from "../helpers/utils";

export const refreshToken = async (req: Request, res: Response) => {
    const accessToken = res.locals.token;
    const decode: JwtPayload = jwt.decode(accessToken) as JwtPayload;
    const oldRefrToken = await queryRefreshToken(decode);

    if (typeof oldRefrToken == 'boolean') {
        res.clearCookie(process.env.COOKIE_NAME!);
        return res.json(responseApp(false, "Token no valido"));
    }

    const { user_id, email, role, token } = oldRefrToken;

    try {
        // Check signature refresh token
        const refreshToken: JwtPayload = jwt.verify(token, process.env.REFRESH_TOKEN!) as JwtPayload;
        const { uid, session_id } = refreshToken;

        // check if token is blacklisted
        const objSession = await db.getDb().collection(ref.BLACKLIST_TOKEN).
            findOne({ user_id: new ObjectId(uid), session_id });
        if (objSession != null) return responseApp(false, "Token vencido");

        await db.getDb().collection(ref.REFRESH_TOKEN).deleteOne({ user_id: new ObjectId(uid), session_id, });
        await db.getDb().collection(ref.BLACKLIST_TOKEN).insertOne(oldRefrToken);

        generateToken({ uid: user_id, email, role, res });
        return res.json(responseApp(true, "Token generados"));

    } catch (error) {
        const decode: JwtPayload = jwt.decode(token) as JwtPayload;
        const { session_id } = decode;
        await db.getDb().collection(ref.REFRESH_TOKEN).deleteOne({ user_id: new ObjectId(decode.uid), session_id });
        return res.json(responseApp(false, "Token no valido"));
    }
}
