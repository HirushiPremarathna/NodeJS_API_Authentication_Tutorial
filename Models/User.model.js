const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    //hash the password
    console.log("called before saving the user")
    const salt = await bcrypt.genSalt(10); //10 is the number of rounds
    //create a password hash (hash + salt = password)
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next(); //go to the next middleware
  } catch (error) {
    next(error);
  }
});

// UserSchema.post("save", function (next) {
//   try {
//     console.log("called after saving the user");
//   } catch (error) {
//     next(error);
    
//   }
// });

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // here error is simply thrown as it is not a middleware
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
