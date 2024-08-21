import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const secretKey = process.env.JWT_KEY;
if (!secretKey) {
  throw new Error("JWT_KEY is not defined in the environment variables");
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { token: string; email: string; _id: string }; // Include token in the user type
    }
  }
}

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // Check if the error is related to token expiration
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }

      return res.sendStatus(403); // Forbidden for other verification errors
    }

    // Ensure that the user is an object before spreading
    if (typeof user === "object" && user !== null) {
      req.user = {
        ...user,
        token,
      } as JwtPayload & { token: string; email: string; _id: string }; // Ensure the user property has the token
    }

    next();
  });
};

export default authenticateToken;
