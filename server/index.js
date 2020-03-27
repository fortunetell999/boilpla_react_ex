const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("--mongodb connected--");
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));
app.post("/api/user/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/user/login", (req, res) => {
  // whether DB has email
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "Please check your email or password"
      });
    }
    //password matching
    userInfo.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "Please check your email or password"
        });
      }

      //both email and pw correct : create Token
      userInfo.generateToken((err, user) => {
        if (err) return status(400).send(err);
        //save token 1)cookie 2)local storage available
        //1)cookie
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//authentication
app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

//logout
app.get("/api/user/logout", auth, (req, res) => {
  //find user from DB & erase user's token
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { token: "" } },
    (err, user) => {
      if (err)
        return res.json({
          logoutSuccess: false,
          message: err
        });
      return res.status(200).send({ success: true });
    }
  );
});

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
