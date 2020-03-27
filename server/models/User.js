const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const config = require("../config/key");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
});

//password encryption
userSchema.pre("save", function(next) {
  let user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//compare password when login
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//generate token
userSchema.methods.generateToken = function(cb) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), config.secretToken);

  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

//decode token & find user
userSchema.statics.findByToken = function(token, cb) {
  let user = this;
  jwt.verify(token, config.secretToken, function(err, decoded) {
    //find user
    //token from client === token from mongoDB
    user.findOne({ _id: decoded, token }, function(err, user) {
      if (err) return cb(err);
      //console.log(user);
      cb(null, user);
    });
  });
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
