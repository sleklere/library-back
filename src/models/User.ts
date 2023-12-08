import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import isEmail from "validator/lib/isEmail.js";

export interface IUser extends Document {
  createdAt: Date;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
}

interface IUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
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
      validate: [isEmail as any, "Please provide a valid email"],
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
        validator: function (this: IUser, el: string) {
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
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
