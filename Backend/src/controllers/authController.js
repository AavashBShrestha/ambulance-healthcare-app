const jwt = require("jsonwebtoken");
const { User, SIGNUP_ROLES, PASSWORD_RULE, PASSWORD_MESSAGE } = require("../models/User");

const isProduction = () => process.env.NODE_ENV === "production";

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
});

const sendAuthCookie = (res, user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
  const days = Number(process.env.JWT_COOKIE_DAYS || 1);
  res.cookie("jwt", token, { ...cookieOptions(), maxAge: days * 24 * 60 * 60 * 1000 });
};

const signup = async (req, res, next) => {
  try {
    const { name, username, email, password, role = "patient" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }
    if (!PASSWORD_RULE.test(password)) {
      return res.status(400).json({ message: PASSWORD_MESSAGE });
    }
    if (!SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.create({ name, username, email, password, role });
    sendAuthCookie(res, user);
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    sendAuthCookie(res, user);
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("jwt", cookieOptions());
  return res.status(200).json({ message: "Logged out" });
};

module.exports = { signup, login, me, logout };
