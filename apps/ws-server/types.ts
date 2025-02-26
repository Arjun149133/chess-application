import type WebSocket from "ws";

export type User = {
  userId: string;
  username: string;
  ws: WebSocket;
};
