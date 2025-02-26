import jwt from "jsonwebtoken";
import type WebSocket from "ws";
import type { User } from "./types";

export const userAuth = (token: string, ws: WebSocket) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object") {
      console.error("decoded is not an object");
      return;
    }

    if (!("userId" in decoded) || !("username" in decoded)) {
      console.error("decoded does not have userId and username");
      return;
    }

    const newUser: User = {
      userId: decoded.userId as string,
      username: decoded.username as string,
      ws: ws,
    };

    return newUser;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
