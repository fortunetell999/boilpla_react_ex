const { User } = require("../models/User");

let auth = (req, res, next) => {
  // get token from client cookie
  let token = req.cookies.x_auth;

  //decode token & find user
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    //if !user auth no
    if (!user) return res.json({ isAuth: false, error: true });
    //if user auth ok
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
