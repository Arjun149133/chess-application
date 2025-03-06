import { GAME_TYPE, NO_PLAYER_AVAILABLE, PLAYERS_ONLINE } from "./messages";
import type { User } from "./types";

export class PlayerTimer {
  private playerCount: number;
  private pendingGameId: Map<GAME_TYPE, string | null>;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(
    playerCount: number,
    pendingGameId: Map<GAME_TYPE, string | null>
  ) {
    this.playerCount = playerCount;
    this.pendingGameId = pendingGameId;
  }

  incrementPlayerCount() {
    this.playerCount++;
  }

  decrementPlayerCount() {
    this.playerCount--;
  }

  playersOnline(player: User) {
    player.ws.send(
      JSON.stringify({
        type: PLAYERS_ONLINE,
        payload: {
          playersOnline: this.playerCount,
        },
      })
    );

    this.interval = setInterval(() => {
      player.ws.send(
        JSON.stringify({
          type: PLAYERS_ONLINE,
          payload: {
            playersOnline: this.playerCount,
          },
        })
      );
    }, 1000);
  }

  stopSearching(gameType: GAME_TYPE, player: User) {
    this.timer = setTimeout(() => {
      this.pendingGameId.delete(gameType);
      player.ws.send(JSON.stringify({ type: NO_PLAYER_AVAILABLE }));
    }, 60000);
  }

  clearTimeInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  clear() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
