import { Request, Response } from "express";
import { database as db } from "../settings/db";
import { Collections as ref } from "../database/collection";
import { responseApp } from "../helpers/utils";
import { User } from "../models/user";
import { ObjectId } from "bson";


export const getUsers = async (req: Request, res: Response) => {
    const objUser = await db.getDb().collection(ref.USERS).find().toArray();
    if (objUser == null) return res.json(responseApp(false, "No hay usuarios registrados"));
    const users = objUser.map(doc => doc as User);
    res.json(responseApp(true, "Consulta exitosa", users));
}

export const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (id.length == 0) return res.json(responseApp(false, "No se encontro el id"));
    const objUser = await db.getDb().collection(ref.USERS).findOne({ _id: new ObjectId(id) });
    if (objUser == null) return res.json(responseApp(false, "No se encontro el usuario"));
    const user = objUser as User;
    res.json(responseApp(true, "Consulta exitosa", user));
}
