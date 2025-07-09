import express from "express";
import { newUser, loginUser} from '../controllers/auth.controller.js';
import { userVerification } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", newUser);
router.post("/login", loginUser);
router.post("/verify",userVerification)

export default router;