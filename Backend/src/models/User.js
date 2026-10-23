const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["patient", "ambulance", "hospital", "bloodbank", "admin"];
const SIGNUP_ROLES = ROLES.filter((role) => role !== "admin");

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_MESSAGE =
  "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character.";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "patient" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = { User, ROLES, SIGNUP_ROLES, PASSWORD_RULE, PASSWORD_MESSAGE };
