const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./Helpers/init_mongodb");

const { verifyAccessToken } = require("./Helpers/jwt_helper"); //middleware

const client = require("./Helpers/init_redis");
client.SET("foo", "bar");
client.GET("foo", (err, value) => {
  if (err) console.log(err.message);
  console.log(value);
});

const AuthRoute = require("./Routes/Auth.route");

const app = express();
app.use(morgan("dev"));

app.use(express.json()); // for pass req.body in json format
app.use(express.urlencoded({ extended: true })); //json or formdat can be handled


app.get("/", verifyAccessToken, async (req, res, next) => {
  console.log(req.headers["authorization"])
  res.send("Hello from express");
});

app.use('/auth', AuthRoute);

//handle errors
app.use(async (req, res, next) => {
//   const erorr = new Error("Not found");
//   error.status = 404;
//   next(error);
    next(createError.NotFound());
});

//error handler
app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
