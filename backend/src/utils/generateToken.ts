import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: any, userId: string) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_123';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_123';

  // Access Token: 15 minutes
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '15m',
  });

  // Refresh Token: 7 days
  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: '7d',
  });

  // Set Access Token cookie (Strictly same site, short life)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set Refresh Token cookie (Strictly same site, longer life)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth] Tokens issued for User ID: ${userId}`);
  }

  return { token, refreshToken };
};

export default generateToken;