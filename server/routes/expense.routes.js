import express from "express";
import { listExpenses, newExpense, getExpense, updateExpense, deleteExpense} from '../controllers/expense.controller.js';
import { userVerification } from "../middleware/auth.middleware.js";
import {body, validationResult} from "express-validator";
const router = express.Router();
router.use(userVerification)

router.get("/",  listExpenses);
router.get("/:id", getExpense);

router.post("/", [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isFloat({min: 0.01}).withMessage("Price must be at least 0.01"),
    body("category").notEmpty().withMessage("Category is required"),
],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    },
    newExpense
);

router.put("/:id", [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isFloat({min: 0.01}).withMessage("Price must be at least 0.01"),
    body("category").notEmpty().withMessage("Category is required"),
],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }, updateExpense);

router.delete("/:id", deleteExpense)

export default router;