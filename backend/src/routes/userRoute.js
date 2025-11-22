import express from "express";
import { get } from "mongoose";
import { authMe } from "../controllers/userController.js";


const router = express.Router();

router.get("/me", authMe);
export default router;