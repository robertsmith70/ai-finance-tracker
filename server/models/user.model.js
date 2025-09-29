import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    required: [true, "Your email address is required"],
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']    
  },
  username: {
    required: [true, "Your username is required"],
    type: String
  },
  password: {
    required: [true, "Your password is required"],
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); //this line was added  to stop rehashing of already hashed passwords
    this.password = await bcrypt.hash(this.password,12);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;