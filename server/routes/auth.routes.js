import express from "express";
import { newUser, loginUser} from '../controllers/auth.controller.js';
import { userVerification } from "../middleware/auth.middleware.js";
import {body, validationResult} from "express-validator";

const router = express.Router();

router.post("/signup", [
    body("email").notEmpty().withMessage("Email is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }, newUser);
router.post("/login", [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }, loginUser);
router.post("/verify", userVerification, (req, res) => {
  return res.status(200).json({ status: true, user: req.user });
});

// (optional) logout if you haven’t added it yet
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
});
export default router;