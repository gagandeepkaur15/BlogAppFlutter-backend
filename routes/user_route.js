import express from "express";
import { getAllUsers, getUserById, login, userSignUp } from "../controllers/user_controller.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);
userRoute.get("/:id", getUserById);
userRoute.post("/signup", userSignUp);
userRoute.post("/login", login);

export default userRoute