import { client } from "@repo/db/client";
import { GAME_TYPE } from "./messages";
import type { User } from "./types";
import { Chess, Move } from "chess.js";
import { randomUUID } from "crypto";

export class Game {
  public gameId: string;
  private whitePlayer: User;
  private blackPlayer: User;
  private gameType: GAME_TYPE;
  private chess: Chess;
  //   private timer: NodeJS.Timeout | null;
  constructor(whitePlayer: User, blackPlayer: User, gameType: GAME_TYPE) {
    this.gameId = randomUUID();
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.gameType = gameType;
    this.chess = new Chess();
    this.init_game();
  }

  private async init_game() {
    try {
      const newGame = await client.game.create({
        data: {
          id: this.gameId,
          whitePlayer: {
            connect: {
              id: this.whitePlayer.userId,
            },
          },
          blackPlayer: {
            connect: {
              id: this.blackPlayer.userId,
            },
          },
          time: this.gameType as unknown as
            | "CLASSICAL"
            | "BLITZ"
            | "RAPID"
            | "BULLET",
        },
      });

      const message = JSON.stringify({
        type: "init_game",
        payload: {
          gameId: this.gameId,
          gameType: this.gameType,
          whitePlayer: this.whitePlayer.username,
          blackPlayer: this.blackPlayer.username,
        },
      });

      this.broadCast(message);
    } catch (error) {
      console.error(error);
    }
  }

  makeMove(move: Move) {}

  private broadCast(msg: string) {
    const data = JSON.parse(msg);

    this.whitePlayer.ws.send(
      JSON.stringify({
        type: data.type,
        payload: data.payload,
      })
    );
    this.blackPlayer.ws.send(
      JSON.stringify({
        type: data.type,
        payload: data.payload,
      })
    );
  }
}
