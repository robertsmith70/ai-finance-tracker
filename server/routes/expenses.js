const express = require('express');
const router = express.Router();

let expenses = [
    {id: 1, name: "Choclate", price: 2.99}, {id: 2, name: "Crisps", price: 0.99}
];

router.post('/', (req, res) => {
    const { name } = req.body;
    const { price } = req.body;
    const newExpense = {id: expenses.length + 1, name, price};
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

router.get('/', (req, res) => {
    res.json(expenses);
});


router.put('/:id', (req, res) => {
    const expense = expenses.find(i => i.id === parseInt(req.params.id));
    if (!expense) return res.status(404).send('Expense not found');
    if(!req.body.name) return res.status(400).send('name is required');
    expense.name = req.body.name;
    res.json(expense);
});

router.delete('/:id', (req, res) => {
    const expensesIndex = expenses.findIndex(i => i.id === parseInt(req.params.id));
    if (expensesIndex === -1) return res.status(404).send('Expense not found');
    const deletedExpense = expenses.splice(expensesIndex, 1);
    res.json(deletedExpense);
});

module.exports = router;