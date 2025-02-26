import { Game } from "./Game";
import { INIT_GAME, MOVE, type GAME_TYPE } from "./messages";
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
              type: "waiting",
              payload: {
                message: "waiting for other player",
              },
            })
          );
        } else {
          const otherPlayerId = this.pendingGameId.get(gameType);
          if (otherPlayerId) {
            const otherPlayer = this.players.find(
              (p) => p.userId === otherPlayerId
            );
            if (!otherPlayer) {
              console.error("other player not found");
              return;
            }
            const game = new Game(player, otherPlayer, gameType);
            this.games.push(game);
            this.pendingGameId.delete(gameType);
          } else {
            this.pendingGameId.set(gameType, player.userId);
            player.ws.send(
              JSON.stringify({
                type: "waiting",
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
      }
    });
  }

  removePlayer(player: User) {
    this.players = this.players.filter((p) => p.userId !== player.userId);
  }
}
