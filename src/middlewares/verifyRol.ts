import { Request, Response, NextFunction } from "express";
import { database as db } from "../settings/db";
import { JwtPayload } from "../interfaces/interfaces";
import { Collections as ref } from "../database/collection";
import { ObjectId } from "bson";
import { responseApp } from "../helpers/utils";
import { User } from "../models/user";

export const verifyRol = async (req: Request, res: Response, next: NextFunction) => {
    const payload: JwtPayload = res.locals.accessToken;
    const { uid } = payload;

    const objUser = await db.getDb().collection(ref.USERS).findOne({ _id: new ObjectId(uid) });
    if (objUser == null) return res.json(responseApp(false, "Usuario no encontrado"));

    const user = objUser as User;
    if (user.role != "admin") return res.json(responseApp
        (false, "No tienes autorización para acceder a este recurso"));

    next();
}