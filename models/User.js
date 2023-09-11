const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      maxlength: [20, "Your username can't be longer than 20 characters"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provid a password"],
      minlength: 10,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please re-enter your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords must match!",
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// encrypt password before being saved to db (after validator is ran)
userSchema.pre("save", async function (next) {
  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
