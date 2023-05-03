import { Request, Response } from "express";
import { User } from "../models/user"
import { database as db } from "../settings/db";
import { encryptPassword, responseApp, verifyPassword } from "../helpers/utils";
import { Collections as ref } from "../database/collection";
import { generateToken } from "../helpers/tokens";
import { JwtPayload } from "../interfaces/interfaces";
import { ObjectId } from "bson";
import { RefreshToken } from "../models/refreshToken";


export const signIn = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    // Get find email in database
    const objUser = await db.getDb().collection(ref.USERS).findOne({ email });
    // Check user not exists
    if (objUser == null) {
        return res.json(responseApp(false, "Usuario y password no son correctos"));
    }

    const check = await verifyPassword(password, objUser['password']);
    if (!check) return res.json(responseApp(false, "Usuario y password no son correctos"));

    const user = { ...objUser as User };
    generateToken({ uid: user._id!, email: user.email, role: user.role, res });
    res.json(responseApp(true, "Inicio sesión correctamente", { "_id": user._id, "email": user.email, "role": user.role }));
}

export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const pass = await encryptPassword(password);

    const user: User = {
        email: email.toLowerCase(),
        password: pass,
        role: "owner",
        createdAt: new Date().getTime()
    }

    db.getDb().collection(ref.USERS).insertOne(user);
    res.json({
        "ok": true,
        "message": "Creado exitosamente",
        "result": "n/a",
        "error": "n/a"
    });
}

export const logout = async (req: Request, res: Response) => {
    // token information 
    const payload: JwtPayload = res.locals.accessToken;
    const { uid, session_id } = payload;

    // Check exists refresh Token
    const objSession = await db.getDb().collection(ref.REFRESH_TOKEN).
        findOne({ user_id: new ObjectId(uid), session_id });
    if (objSession == null) return res.json(responseApp(false, "No tienes permiso para cerrar sesión"));

    const objUser = await db.getDb().collection(ref.USERS).findOne({ _id: new ObjectId(uid) });
    if (objUser == null) {
        return responseApp(false, "Usuario no valido");
    }

    const oldRefrToken: RefreshToken = {
        user_id: objSession['user_id'],
        email: objSession['email'],
        role: objSession['role'],
        session_id: objSession['session_id'],
        token: objSession['token']
    };

    await db.getDb().collection(ref.REFRESH_TOKEN).deleteOne({ user_id: new ObjectId(uid), session_id });
    await db.getDb().collection(ref.BLACKLIST_TOKEN).insertOne(oldRefrToken);
    res.clearCookie('rastari-token');
    res.json(responseApp(true, "Cerro sesión"));
}