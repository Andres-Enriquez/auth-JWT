import { TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { responseApp } from "../helpers/utils";
import { checkCookieSignature } from "../helpers/cookies";
import { checkAccessToken } from "../helpers/tokens";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    const token = await checkCookieSignature(req, res);
    if (typeof token == "boolean") return res.json(responseApp(false, "Cookie no válida"));

    try {
        const payload = await checkAccessToken(token);
        if ("ok" in payload) return res.json(payload);

        res.locals.accessToken = payload;
        next();

    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            return res.json(responseApp(false, "Token Expirado"));
        }
        res.json(responseApp(false, "Token no válido"));
    }
}

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const token = await checkCookieSignature(req, res);
    if (typeof token == "boolean") return res.json(responseApp(false, "Cookie no válida"));

    try {
        const payload = await checkAccessToken(token);
        if ("ok" in payload) return res.json(payload);

        res.locals.accessToken = payload;
        next();
        res.json(responseApp(true, "Token verificado"));

    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            res.locals.token = token;
            next();
            return;
        }
        res.json(responseApp(false, "Token no válido"));
    }
}