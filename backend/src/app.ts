import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
  RequestHandler,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

import { notFound, errorHandler } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import adminRoutes from "./routes/adminRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

/* 🔥 REQUIRED FOR RENDER SECURE COOKIES */
app.set("trust proxy", 1);

/* =======================================================
   ✅ CORS (Hardcoded to avoid env mismatch)
======================================================= */
app.use(
  cors({
    origin: "https://impulseind.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-razorpay-signature",
    ],
  })
);

app.options("*", cors());

/* =======================================================
   ✅ Security
======================================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =======================================================
   ✅ Request Trace ID
======================================================= */
app.use(
  ((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    (req as any).id = uuidv4();
    next();
  }) as RequestHandler
);

/* =======================================================
   ✅ Logging
======================================================= */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev") as any
);

/* =======================================================
   ✅ Rate Limiting (unchanged)
======================================================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 500 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
});

// app.use("/api", limiter as any);

/* =======================================================
   ✅ Body Parsing
======================================================= */
app.use(express.json({ limit: "10kb" }) as any);
app.use(express.urlencoded({ extended: true }) as any);
app.use(cookieParser() as any);

/* =======================================================
   ✅ Data Sanitization & Performance
======================================================= */
app.use(mongoSanitize());
app.use(compression() as any);

/* =======================================================
   ✅ Health Route
======================================================= */
app.get("/health", (req, res) =>
  res.json({ status: "UP", timestamp: new Date() })
);

/* =======================================================
   ✅ Routes
======================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

/* =======================================================
   ✅ Error Handling
======================================================= */
app.use(notFound);
app.use(errorHandler);

export default app;
