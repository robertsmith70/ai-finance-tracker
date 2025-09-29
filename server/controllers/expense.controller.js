import Expense from '../models/expense.model.js'; 

export const listExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({user: req.user._id}); 
    res.status(200).json(expenses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const newExpense =  async (req, res) => {
    const {name, price, category, description} = req.body;
    if(!name || !category || price == null) return res.status(400).send('name, price and category is required');
    if(price < 0.01)  return res.status(400).send('Price must be at least 0.01');
    try{
        const expense = new Expense({name, price, category, description, user: req.user._id, })
        const expenseToSave = await expense.save();
        res.status(201).json(expenseToSave);
    } catch(error){
        res.status(400).json({message: error.message});
    }
};

export const updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense || expense.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  Object.assign(expense, req.body);

  try {
    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense || expense.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    await expense.deleteOne();
    res.send(`Expense "${expense.name}" has been deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
