const exprss = require("express");
const router = exprss.Router();
const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../Helpers/validation_schema");
const { signAccessToken } = require("../Helpers/jwt_helper");

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

    const accessToken = await signAccessToken(savedUser.id); // as signAccessToken is a promise we need to use await.
    //res.send(savedUser);
    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422; //Unprocessable Entity

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  //res.send("Login");
  try {
    /**
     * check the email and password is valid or not
     * if not valid throw error
     * 
     * if valid check the email is registered or not
     * if not registered throw error
     * 
     * if registered check the password is matched or not
     * if not matched throw error 
     * dont say password is wrong as it is a security issue
     * 
     * if matched generate the access token and send it to the client
     */
    const result = await authSchema.validateAsync(req.body);

    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createError.Unauthorized("Username/password not valid");

    const accessToken = await signAccessToken(user.id);

    //res.send(result);
    res.send({ accessToken });
  } catch (error) {
    /**
       when an invalid username or password is entered
       we do not need to send the exact error message to the client
       instead we check is it because of validation error (isJOI)
    **/
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Username/Password"));
    next(error);
  }
});

router.post("/refresh-token", (req, res, next) => {
  res.send("Refresh Token");
});

router.delete("/logout", (req, res, next) => {
  res.send("Logout");
});

module.exports = router;
