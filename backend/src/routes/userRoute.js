import express from "express";
import { get } from "mongoose";
import { authMe } from "../controllers/userController.js";
import { searchUserByUsername } from "../controllers/userController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);
router.post("/uploadAvatar", upload.single("file"), uploadAvatar);
export default router;