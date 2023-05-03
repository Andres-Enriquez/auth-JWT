import { Request, Response } from "express";

export const checkCookieSignature = async (req: Request, res: Response): Promise<boolean | string> => {
    // Check access token in cookies
    const token: any = req.signedCookies[process.env.COOKIE_NAME!];
    if (!token) {
        res.clearCookie(process.env.COOKIE_NAME!);
        return false;
    }
    return token;
}

export const setCookie = (token: string, res: Response) => {
    res.cookie(process.env.COOKIE_NAME!, token, { httpOnly: true, secure: true, signed: true });
}