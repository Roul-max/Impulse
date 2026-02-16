import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const secret = process.env.JWT_SECRET || "dev_secret_123";
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_123";

  // Create Access Token (15 minutes)
  const accessToken = jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });

  // Create Refresh Token (7 days)
  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: "7d",
  });

  /**
   * IMPORTANT:
   * Since frontend (Vercel) and backend (Render) are on different domains,
   * cookies MUST use:
   * - secure: true
   * - sameSite: "none"
   * - path: "/"
   */

  // Access Token Cookie
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh Token Cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessToken, refreshToken };
};

export default generateToken;
