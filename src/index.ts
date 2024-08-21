import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// database function
import connectDB from "./config/db";

//import routes
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";

dotenv.config();

// connect to database
connectDB();

const app = express();

// Init Middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
