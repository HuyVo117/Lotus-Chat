import express from "express";
import { get } from "mongoose";
import { authMe } from "../controllers/userController.js";
import { searchUserByUsername } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);
export default router;