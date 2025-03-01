import { client } from "@repo/db/client";
import {
  GAME_TYPE,
  GAME_RESULT,
  GAME_PROGRESS,
  PLAYER_TIME,
  DRAW,
  OFFER_DRAW,
  DECLINE_DRAW,
  INIT_GAME,
} from "./messages";
import type { MoveType, User } from "./types";
import { Chess, Move, type Square } from "chess.js";
import { randomUUID } from "crypto";
import { isPromoting, returnsTime } from "./utils";

export class Game {
  public gameId: string;
  public whitePlayer: User;
  public blackPlayer: User;
  private gameType: GAME_TYPE;
  private chess: Chess;
  private moveCount: number = 0;
  private whitePlayerTimeRemaining: number;
  private blackPlayerTimeRemaining: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private abondonedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(whitePlayer: User, blackPlayer: User, gameType: GAME_TYPE) {
    this.gameId = randomUUID();
    this.whitePlayer = whitePlayer;
    this.blackPlayer = blackPlayer;
    this.gameType = gameType;
    const game_time = returnsTime(gameType);
    this.whitePlayerTimeRemaining = game_time;
    this.blackPlayerTimeRemaining = game_time;
    this.chess = new Chess();
  }

  async initGame() {
    try {
      await this.addGameToDb();

      const message = JSON.stringify({
        type: INIT_GAME,
        payload: {
          gameId: this.gameId,
          gameType: this.gameType,
          whitePlayer: this.whitePlayer.username,
          blackPlayer: this.blackPlayer.username,
        },
      });

      this.broadCast(message);
      this.sendWhitePlayerTimeCount();
      this.abondonedGame(this.whitePlayer);
    } catch (error) {
      console.error(error);
    }
  }

  updateWhitePlayer(player: User) {
    this.whitePlayer = player;
  }

  updateBlackPlayer(player: User) {
    this.blackPlayer = player;
  }

  async addGameToDb() {
    try {
      await client.game.create({
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
          whitePlayerTimeRemaining: this.whitePlayerTimeRemaining,
          blackPlayerTimeRemaining: this.blackPlayerTimeRemaining,
        },
      });
    } catch (error) {
      console.error("error while adding game to db: ", error);
    }
  }

  async addMoveToDb(move: Move) {
    try {
      await client.$transaction([
        client.move.create({
          data: {
            gameId: this.gameId,
            from: move.from,
            to: move.to,
            piece: move.piece,
            captured: move.captured,
            promotion: move.promotion,
          },
        }),

        client.game.update({
          where: {
            id: this.gameId,
          },
          data: {
            currentFen: this.chess.fen(),
          },
        }),
      ]);
    } catch (error) {
      console.error("error while adding move to db: ", error);
    }
  }

  async makeMove(player: User, move: MoveType) {
    try {
      if (
        this.chess.turn() === "w" &&
        player.userId !== this.whitePlayer.userId
      ) {
        console.log("white player's turn");
        return;
      }
      if (
        this.chess.turn() === "b" &&
        player.userId !== this.blackPlayer.userId
      ) {
        console.log("black player's turn");
        return;
      }

      let moveResult: Move;

      if (isPromoting(this.chess, move.from as Square, move.to as Square)) {
        moveResult = this.chess.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
      } else {
        moveResult = this.chess.move({
          from: move.from,
          to: move.to,
        });
      }
      this.moveCount++;

      if (this.chess.turn() === "w") {
        this.sendWhitePlayerTimeCount();
        this.abondonedGame(this.whitePlayer);
      } else {
        this.sendBlackPlayerTimeCount();
        this.abondonedGame(this.blackPlayer);
      }

      await this.addMoveToDb(moveResult);

      if (this.chess.isGameOver()) {
        if (this.chess.isDraw()) {
          await this.gameOver("", GAME_RESULT.DRAW, GAME_PROGRESS.FINISHED);
        } else if (player.userId === this.whitePlayer.userId) {
          await this.gameOver(
            player.userId,
            GAME_RESULT.WHITEWIN,
            GAME_PROGRESS.FINISHED
          );
        } else {
          await this.gameOver(
            player.userId,
            GAME_RESULT.BLACKWIN,
            GAME_PROGRESS.FINISHED
          );
        }
      }

      if (this.chess.isInsufficientMaterial()) {
        await this.gameOver("", GAME_RESULT.DRAW, GAME_PROGRESS.FINISHED);
      }

      const message = JSON.stringify({
        type: "move",
        payload: {
          gameId: this.gameId,
          move: moveResult,
        },
      });
      this.broadCast(message);
    } catch (error) {
      console.error(error);
      const message = JSON.stringify({
        type: "invalid_move",
        payload: {
          gameId: this.gameId,
        },
      });
      this.broadCast(message);
    }
  }

  resign(player: User) {
    if (player.userId === this.whitePlayer.userId) {
      this.gameOver(
        player.userId,
        GAME_RESULT.BLACKWIN,
        GAME_PROGRESS.PLAYEREXIT
      );
    } else {
      this.gameOver(
        player.userId,
        GAME_RESULT.WHITEWIN,
        GAME_PROGRESS.PLAYEREXIT
      );
    }
  }

  offerDraw(player: User) {
    const message = JSON.stringify({
      type: DRAW,
      payload: {
        gameId: this.gameId,
        action: OFFER_DRAW,
        player: player.userId,
      },
    });
    if (player.userId === this.whitePlayer.userId) {
      this.blackPlayer.ws.send(message);
    } else {
      this.whitePlayer.ws.send(message);
    }
  }

  acceptDraw() {
    this.gameOver("", GAME_RESULT.DRAW, GAME_PROGRESS.FINISHED);
  }

  declineDraw(player: User) {
    const message = JSON.stringify({
      type: DRAW,
      payload: {
        gameId: this.gameId,
        action: DECLINE_DRAW,
        player: player.userId,
      },
    });
    if (player.userId === this.whitePlayer.userId) {
      this.blackPlayer.ws.send(message);
    } else {
      this.whitePlayer.ws.send(message);
    }
  }

  abondonedGame(player: User) {
    if (this.abondonedTimer) {
      clearTimeout(this.abondonedTimer);
    }

    this.abondonedTimer = setTimeout(() => {
      if (player.userId === this.whitePlayer.userId) {
        this.gameOver(
          player.userId,
          GAME_RESULT.BLACKWIN,
          GAME_PROGRESS.ABANDONED
        );
      } else {
        this.gameOver(
          player.userId,
          GAME_RESULT.WHITEWIN,
          GAME_PROGRESS.ABANDONED
        );
      }
    }, 30000);
  }

  sendWhitePlayerTimeCount() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.whitePlayerTimeRemaining -= 1000;
      if (this.whitePlayerTimeRemaining <= 0) {
        this.gameOver(
          this.blackPlayer.userId,
          GAME_RESULT.BLACKWIN,
          GAME_PROGRESS.TIMEUP
        );
        return;
      }

      const message = JSON.stringify({
        type: PLAYER_TIME,
        payload: {
          gameId: this.gameId,
          whitePlayerTimeRemaining: this.whitePlayerTimeRemaining,
          blackPlayerTimeRemaining: this.blackPlayerTimeRemaining,
        },
      });
      this.broadCast(message);
    }, 1000);
  }

  sendBlackPlayerTimeCount() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.blackPlayerTimeRemaining -= 1000;
      if (this.blackPlayerTimeRemaining <= 0) {
        this.gameOver(
          this.whitePlayer.userId,
          GAME_RESULT.WHITEWIN,
          GAME_PROGRESS.TIMEUP
        );
        return;
      }

      const message = JSON.stringify({
        type: PLAYER_TIME,
        payload: {
          gameId: this.gameId,
          whitePlayerTimeRemaining: this.whitePlayerTimeRemaining,
          blackPlayerTimeRemaining: this.blackPlayerTimeRemaining,
        },
      });
      this.broadCast(message);
    }, 1000);
  }

  private async gameOver(
    winnerId: string,
    result: GAME_RESULT,
    progress: GAME_PROGRESS
  ) {
    await client.game.update({
      where: {
        id: this.gameId,
      },
      data: {
        progress: progress,
        result: result,
        blackPlayerTimeRemaining: this.blackPlayerTimeRemaining,
        whitePlayerTimeRemaining: this.whitePlayerTimeRemaining,
      },
    });

    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.abondonedTimer) {
      clearTimeout(this.abondonedTimer);
    }
    const message = JSON.stringify({
      type: "game_over",
      payload: {
        gameId: this.gameId,
        winner: winnerId,
        progress: progress,
        result: result,
      },
    });

    this.broadCast(message);
  }

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
