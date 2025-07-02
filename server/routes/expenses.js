const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

router.post('/', async (req, res) => {

    const {name, price, category} = req.body;
    if(!name || !category || price == null) return res.status(400).send('name, price and category is required');
    if(price < 0.01)  return res.status(400).send('Price must be at least 0.01');
    try{
        const expense = new Expense({name, price, category})
        const expenseToSave = await expense.save();
        res.status(201).json(expenseToSave);
    } catch(error){
        res.status(400).json({message: error.message});
    }
});

router.get('/', async (req, res) => {
    try{
        const expense = await Expense.find();
        res.json(expense);
    } catch(error){
        res.status(400).json({message: error.message});
    }
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