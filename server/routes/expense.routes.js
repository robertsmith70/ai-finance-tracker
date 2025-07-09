import express from "express";
import { listExpenses, newExpense, getExpense, updateExpense, deleteExpense} from '../controllers/expense.controller.js';
import { userVerification } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(userVerification)

router.get("/",  listExpenses);
router.get("/:id", getExpense);
router.post("/", newExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense)

export default router;