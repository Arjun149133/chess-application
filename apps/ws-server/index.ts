import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
import url from "url";
import { userAuth } from "./user";
import type { User } from "./types";

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();
wss.on("connection", function connection(ws, req) {
  ws.on("error", console.error);

  const token: string = url.parse(req.url!, true).query.token as string;
  const user: User | undefined = userAuth(token, ws);
  if (!user) {
    console.error("user not authenticated");
    ws.close();
    return;
  }

  console.log("connected", user.username);
  gameManager.addPlayer(user);

  ws.on("close", () => {
    console.log("disconnected", user.username);
    gameManager.removePlayer(user);
  });
});
