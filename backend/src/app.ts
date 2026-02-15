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

/* =======================================================
   ✅ CORS MUST COME FIRST (for cookie authentication)
======================================================= */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-razorpay-signature",
    ],
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

/* =======================================================
   ✅ SECURITY (Helmet configured for CORS + cookies)
======================================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =======================================================
   ✅ Trace ID Middleware
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
   ✅ Rate Limiting
======================================================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter as any);

/* =======================================================
   ✅ Standard Middleware
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
   ✅ Routes
======================================================= */
app.get("/health", (req, res) =>
  res.json({ status: "UP", timestamp: new Date() })
);

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
