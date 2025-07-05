import Expense from '../models/expense.model.js'; 

export const listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find(); 
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getExpense = async (req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        res.json(expense);
    } catch(error){
        res.status(400).json({message: error.message});
    }
};

export const newExpense =  async (req, res) => {
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
};

export const updateExpense = async (req, res) => {
    try{
        const updatedExpense = req.body;
        const options = { new: true };
        const expense = await Expense.findByIdAndUpdate(req.params.id, updatedExpense, options);
        
        res.send(expense);
    } catch(error){
        res.status(400).json({message: error.message});
    }
};


export const deleteExpense = async (req, res) => {
    try{
        const expense = await Expense.findByIdAndDelete(req.params.id);
        res.send(`Expense "${expense.name}" has been deleted`);
    } catch(error){
        res.status(400).json({message: error.message});
    }
};