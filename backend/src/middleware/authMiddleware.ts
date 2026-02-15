import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "./asyncHandler";
import { User, IUser } from "../models/User";

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1️⃣ Check HTTP-only cookie
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // 2️⃣ Check Authorization header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ If no token found
    if (!token) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ No token found");
      }
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      const secret = process.env.JWT_SECRET as string;

      const decoded = jwt.verify(token, secret) as {
        userId: string;
      };

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        if (process.env.NODE_ENV === "development") {
          console.log("❌ User not found");
        }
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      req.user = user;

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Authenticated:", user.email);
      }

      next();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Token verification failed");
      }
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
);

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Admin access:", req.user.email);
    }
    next();
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log("❌ Admin access denied");
    }
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
