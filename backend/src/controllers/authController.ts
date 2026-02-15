import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { User } from '../models/User';
import generateToken from '../utils/generateToken';
import jwt from 'jsonwebtoken';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (process.env.NODE_ENV === 'development') console.log(`[Auth] Login attempt for: ${email}`);

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id.toString());

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    if (process.env.NODE_ENV === 'development') console.log(`[Auth] Login successful: ${email}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } else {
    if (process.env.NODE_ENV === 'development') console.log(`[Auth] Login failed: Invalid credentials for ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req: any, res: any) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    if (process.env.NODE_ENV === 'development') console.log(`[Auth] New user registered: ${email}`);
    generateToken(res, user._id.toString());

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req: any, res: any) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refresh_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  
  if (process.env.NODE_ENV === 'development') console.log(`[Auth] User logged out`);
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req: any, res: any) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Not authorized, no refresh token');
    }

    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_123';
        const decoded: any = jwt.verify(refreshToken, refreshSecret);

        // Issue new tokens (Rotation)
        generateToken(res, decoded.userId);
        
        if (process.env.NODE_ENV === 'development') console.log(`[Auth] Token refreshed for User ID: ${decoded.userId}`);

        res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
});

export { loginUser, registerUser, logoutUser, refreshToken };