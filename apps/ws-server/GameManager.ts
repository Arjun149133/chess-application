import { client } from "@repo/db/client";
import { Game } from "./Game";
import {
  ACCEPT_DRAW,
  DECLINE_DRAW,
  DRAW,
  GAME_OVER,
  IN_PROGRESS,
  INIT_GAME,
  JOIN_GAME,
  MOVE,
  OFFER_DRAW,
  RESIGN,
  WAITING,
  type GAME_TYPE,
} from "./messages";
import type { User } from "./types";

export class GameManager {
  private games: Game[] = [];
  private players: User[] = [];
  private pendingGameId: Map<GAME_TYPE, string | null> = new Map();
  constructor() {
    this.games = [];
    this.players = [];
    this.pendingGameId = new Map();
  }

  addPlayer(player: User) {
    this.players.push(player);
    this.addHandler(player);
  }

  private addHandler(player: User) {
    player.ws.on("message", async (msg) => {
      const message = JSON.parse(msg.toString());
      if (message.type === INIT_GAME) {
        const gameType = message.payload.gameType;
        if (!this.pendingGameId.has(gameType)) {
          this.pendingGameId.set(gameType, player.userId);
          player.ws.send(
            JSON.stringify({
              type: WAITING,
              payload: {
                message: "waiting for other player",
              },
            })
          );
        } else {
          const whitePlayerId = this.pendingGameId.get(gameType);
          if (whitePlayerId) {
            const whitePlayer = this.players.find(
              (p) => p.userId === whitePlayerId
            );
            if (!whitePlayer) {
              console.error("other player not found");
              return;
            }
            if (whitePlayer.userId === player.userId) {
              player.ws.send(
                JSON.stringify({
                  type: WAITING,
                  payload: {
                    message: "waiting for other player",
                  },
                })
              );
              return;
            }
            const game = new Game(whitePlayer, player, gameType);
            await game.initGame();
            this.games.push(game);
            this.pendingGameId.delete(gameType);
          } else {
            this.pendingGameId.set(gameType, player.userId);
            player.ws.send(
              JSON.stringify({
                type: WAITING,
                payload: {
                  message: "waiting for other player",
                },
              })
            );
          }
        }
      }

      if (message.type === MOVE) {
        const payload = message.payload;
        const game = this.games.find((g) => g.gameId === payload.gameId);

        if (!game) {
          console.error("game not found");
          return;
        }

        await game.makeMove(player, payload.move);
      }

      if (message.type === RESIGN) {
        const payload = message.payload;
        const game = this.games.find((g) => g.gameId === payload.gameId);

        if (!game) {
          console.error("game not found");
          return;
        }

        game.resign(player);
      }

      if (message.type === DRAW) {
        const payload = message.payload;
        const game = this.games.find((g) => g.gameId === payload.gameId);

        if (!game) {
          console.error("game not found");
          return;
        }

        if (payload.action === OFFER_DRAW) {
          game.offerDraw(player);
        } else if (payload.action === ACCEPT_DRAW) {
          game.acceptDraw();
        } else if (payload.action === DECLINE_DRAW) {
          game.declineDraw(player);
        }
      }

      if (message.type === JOIN_GAME) {
        const payload = message.payload;
        const game = this.games.find((g) => g.gameId === payload.gameId);

        if (game) {
          if (game.whitePlayer.userId === player.userId) {
            game.updateWhitePlayer(player);
          } else if (game.blackPlayer.userId === player.userId) {
            game.updateBlackPlayer(player);
          } else {
            return;
          }
        }

        const gameFromDb = await client.game.findUnique({
          where: {
            id: payload.gameId,
          },
          include: {
            blackPlayer: true,
            whitePlayer: true,
          },
        });

        if (!gameFromDb) {
          console.error("game not found");
          return;
        }

        if (gameFromDb.progress === "INPROGRESS") {
          player.ws.send(
            JSON.stringify({
              type: IN_PROGRESS,
              payload: {
                gameId: payload.gameId,
                gameType: gameFromDb.time,
                blackPlayer: gameFromDb.blackPlayer.username,
                whitePlayer: gameFromDb.whitePlayer.username,
                currentFen: gameFromDb.currentFen,
              },
            })
          );
        }

        if (gameFromDb.progress !== "INPROGRESS") {
          player.ws.send(
            JSON.stringify({
              type: GAME_OVER,
              payload: {
                gameId: payload.gameId,
                blackPlayer: gameFromDb.blackPlayer.username,
                whitePlayer: gameFromDb.whitePlayer.username,
                whitePlayerTimeRemaining: gameFromDb.whitePlayerTimeRemaining,
                blackPlayerTimeRemaining: gameFromDb.blackPlayerTimeRemaining,
                currentFen: gameFromDb.currentFen,
                result: gameFromDb.result,
                progress: gameFromDb.progress,
              },
            })
          );
        }
      }
    });
  }

  removePlayer(player: User) {
    this.players = this.players.filter((p) => p.userId !== player.userId);
  }
}
