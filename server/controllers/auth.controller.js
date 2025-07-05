import User from "../models/user.model.js";

import { createSecretToken } from "../util/secret.token.js";
import bcrypt from 'bcrypt';

export const newUser =  async (req, res, next) => {
    const {email, password, username, createdAt } = req.body;
    if(!username || !password || !email) {
        return res.status(400).send('error');
    }
try{
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.json({message: "User already exits"})
        }
        const user = await User.create({email, password, username, createdAt});
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly:true,
        });
        res.status(201).json({ message: "User signed in successfully", success: true, user });
        next();


    } catch(error){
       console.error(error);
    }
};

export const loginUser =  async (req, res, next) => {
    try{

    const {email, password} = req.body;
    if(!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({email});
    if (!user) {
        return  res.status(400).json({message: "incorrect password or email"})
    }

const isMatch = await user.comparePassword(password);
if(!isMatch) {
        return  res.status(400).json({message: "incorrect password or email"})

}
 
       
    
    const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly:true,
        });
        res.status(201).json({ message: "User signed in successfully", success: true, user });
        next();


    } catch(error){
       console.error(error);
    }
};