import mongoose from 'mongoose';
import User from './user.model.js';

const expenseSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number
  },
  category: {
    required: true,
    type: String
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
