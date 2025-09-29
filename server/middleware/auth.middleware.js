import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userVerification = async (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
         return res.status(401).json({message: "Not Authorized", status:false})
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({message: "User not found", status:false})
        }

        req.user = user;
        next();
        
    } catch (err) {
        return res.status(401).json({message: "Invalid token", status:false})
    }
}
