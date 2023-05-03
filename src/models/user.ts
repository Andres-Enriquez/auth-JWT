import { ObjectId } from "bson";

export interface User {
    _id?: ObjectId
    email: string;
    password: string;
    createdAt: number;
    role: string;
}

export interface UserWithoutPassword extends Omit<User, "password"> { }