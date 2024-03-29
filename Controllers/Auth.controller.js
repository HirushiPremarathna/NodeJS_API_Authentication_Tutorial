const createError = require("http-errors");
const User = require("../Models/User.model");
const { authSchema } = require("../Helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../Helpers/jwt_helper");
const client = require("../Helpers/init_redis");

module.exports = {
  register: async (req, res, next) => {
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
      const refreshToken = await signRefreshToken(savedUser.id);
      //res.send(savedUser);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      if (error.isJoi === true) error.status = 422; //Unprocessable Entity

      next(error);
    }
  },

  login: async (req, res, next) => {
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
      if (!isMatch)
        throw createError.Unauthorized("Username/password not valid");

      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);

      //res.send(result);
      res.send({ accessToken, refreshToken });
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
  },

  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) throw createError.BadRequest();

      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);

      res.send({ accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);

      client
        .DEL(userId)
        .then((val) => {
          console.log(val);
          res.sendStatus(204);
        })
        .catch((err) => {
          console.log(err.message);
          throw createError.InternalServerError();
        });
    } catch (error) {
      next(error);
    }
  },
};
