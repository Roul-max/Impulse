import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const secret = process.env.JWT_SECRET as string;
  const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

  if (!secret || !refreshSecret) {
    throw new Error("JWT secrets not defined");
  }

  // 🔐 Access Token (15 mins)
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });

  // 🔄 Refresh Token (7 days)
  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: "7d",
  });

  // 🍪 Access Token Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  // 🍪 Refresh Token Cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`[Auth] Tokens issued for user: ${userId}`);
  }

  return { token, refreshToken };
};

export default generateToken;
