const exprss = require("express");
const router = exprss.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../Helpers/validation_schema");

router.post("/register", async (req, res, next) => {
  try {
    //const { email, password } = req.body;

    //if (!email || !password) throw createError.BadRequest();
    const result = await authSchema.validateAsync(req.body);
    //console.log(result);
    
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist)
      throw createError.Conflict(`${email} is already been registered`);

    //const user = new User({email, password});
    const user = new User(result); //use the result object instead of email and password which includes validation also
    const savedUser = await user.save(); //await is used to wait
    res.send(savedUser);
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Unprocessable Entity

    next(error);
  }
});

router.post("/login", (req, res, next) => {
  res.send("Login");
});

router.post("/refresh-token", (req, res, next) => {
  res.send("Refresh Token");
});

router.delete("/logout", (req, res, next) => {
  res.send("Logout");
});

module.exports = router;
