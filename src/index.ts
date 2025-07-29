import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const app = express();
import morgan from "morgan";
//routers
import itemRouter from "./routes/itemRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";
import tradeItemsRouter from "./routes/tradeItemsRouter.js";
import tradeRouter from "./routes/tradeRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleWare.js";
import cookieParser from "cookie-parser";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(morgan("dev"));

app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from TypeScript backend!");
});

app.post("/", (req, res) => {
  console.log(req);

  res.json({ message: "Data received", data: req.body });
});

app.use("/api/shop", itemRouter);
app.use("/api/orders", authenticateUser, orderRouter);
app.use("/api/trade", tradeItemsRouter);
app.use("/api/trade-offers", authenticateUser, tradeRouter);
app.use("/api/users", authenticateUser, userRouter);
app.use("/api/dashboard", authenticateUser, dashboardRouter);
app.use("/api/auth", authRouter);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

const mongoURI = process.env.MONGO_URL as string;

try {
  await mongoose.connect(mongoURI);
  app.listen(port, () => {
    console.log(`✅ Server running on PORT ${port}`);
  });
} catch (error) {
  console.error("❌ Failed to connect to MongoDB:", error);
  process.exit(1);
}
