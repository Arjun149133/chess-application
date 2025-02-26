import jwt from "jsonwebtoken";
import "dotenv/config";
import { type Request, type Response, type NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== "object") {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    req.user = decoded as any as { username: string; userId: string };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
