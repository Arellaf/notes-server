const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const {
  renderUser,
  renderLoginSuccess,
  renderRefreshSuccess,
  renderUserMessage,
} = require("../views/userView");

const register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json(renderUserMessage("All fields required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(renderUserMessage("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      nickname,
    });

    res.status(201).json(renderUserMessage("User registered successfully"));
  } catch (error) {
    res.status(500).json(renderUserMessage("Server error"));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json(renderUserMessage("Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(renderUserMessage("Invalid credentials"));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(renderLoginSuccess(accessToken, user)); 
  } catch (error) {
    res.status(500).json(renderUserMessage("Server error"));
  }
};

const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json(renderUserMessage("No refresh token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json(renderUserMessage("Invalid refresh token"));
    }

    const newAccessToken = generateAccessToken(user);

    res.json(renderRefreshSuccess(newAccessToken)); 
  } catch (error) {
    return res.status(401).json(renderUserMessage("Invalid refresh token"));
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json(renderUserMessage("User not found"));
    }

    res.json(renderUser(user)); 
  } catch (error) {
    res.status(500).json(renderUserMessage("Server error"));
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
    });

    res.json(renderUserMessage("Logged out successfully"));
  } catch (error) {
    res.status(500).json(renderUserMessage("Server error"));
  }
};

module.exports = { register, login, me, refresh, logout };