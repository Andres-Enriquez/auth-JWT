import { Router } from "express";
import { getUsers, getUserById } from "../controllers/userController";
import { verifyToken } from "../middlewares/verifyJwt";
import { verifyRol } from "../middlewares/verifyRol";

const router: Router = Router();

router.get('/user/:id', verifyToken, getUserById);
router.get('/user', verifyToken, verifyRol, getUsers);

export const userRouter = router;