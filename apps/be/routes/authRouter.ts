import { Router, type Request, type Response } from "express";
import { UserSchema } from "@repo/common/types";
import { client } from "@repo/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const validUserSchema = UserSchema.safeParse({ username, password });
    if (!validUserSchema.success) {
      const message = JSON.parse(validUserSchema.error.message);
      res.status(400).json({
        message: message[0].message,
      });
      return;
    }

    const user = await client.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        username: result.username,
        userId: result.id,
      },
      process.env.JWT_SECRET!
    );

    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await client.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user.id,
      },
      process.env.JWT_SECRET!
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
