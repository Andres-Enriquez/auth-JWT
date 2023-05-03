import { ResponseApp } from "../interfaces/interfaces";
import bcrypt from "bcrypt";

export const responseApp = (ok: boolean, message: string, result: any = "n/a", error: any = "n/a"): ResponseApp => {
    const response: ResponseApp = { ok, message, result, error }
    return response;
}

export const encryptPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    const result = bcrypt.compareSync(password, hash);
    return result;
}
