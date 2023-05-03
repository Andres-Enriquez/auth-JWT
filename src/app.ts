import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { userRouter } from './routes/userRoute';
import { database } from './settings/db';
import { authRouter } from './routes/authRoute';
import { tokenRouter } from './routes/tokenRoute';


const app = express();

dotenv.config();
database.connect();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(cookieParser(process.env.COOKIE_KEY))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(morgan('dev'));
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', tokenRouter);

// Listen port
app.listen(app.get('port'), () => {
    console.log(`Escuchando el puerto ${app.get("port")}`);
});


