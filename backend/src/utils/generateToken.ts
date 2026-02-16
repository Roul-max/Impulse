import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (res: Response, userId: string) => {
  const secret = process.env.JWT_SECRET || "dev_secret_123";
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_123";

  const accessToken = jwt.sign({ userId }, secret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Access Token
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: isProduction,          // MUST be true in production
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  // Refresh Token
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,          // MUST be true in production
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export default generateToken;
