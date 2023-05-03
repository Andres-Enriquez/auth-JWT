import { Router } from "express";
import { verifyRefreshToken } from "../middlewares/verifyJwt";
import { refreshToken } from "../controllers/tokenController";

const router: Router = Router();

router.get('/refresh-token', verifyRefreshToken, refreshToken);

export const tokenRouter = router;