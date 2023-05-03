import { Router } from "express"
import { logout, signIn, signUp } from "../controllers/authController";
import { validateAuth } from "../middlewares/verifyParams";
import { verifyToken } from "../middlewares/verifyJwt";

const router = Router();

router.post('/auth/signIn', validateAuth, signIn);
router.post('/auth/signUp', validateAuth, signUp);
router.get('/logout', verifyToken, logout);

export const authRouter = router;