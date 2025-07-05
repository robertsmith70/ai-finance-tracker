import express from "express";
import { listExpenses, newExpense, getExpense, updateExpense, deleteExpense} from '../controllers/expense.controller.js';

const router = express.Router();

router.get("/", listExpenses);
router.get("/:id", getExpense);
router.post("/", newExpense);
router.post("/:id", updateExpense);
router.delete("/:id", deleteExpense)

export default router;