export enum GAME_TYPE {
  CLASSICAL = "CLASSICAL",
  BLITZ = "BLITZ",
  RAPID = "RAPID",
  BULLET = "BULLET",
}

export enum GAME_RESULT {
  WHITEWIN = "WHITEWIN",
  BLACKWIN = "BLACKWIN",
  DRAW = "DRAW",
  NORESULT = "NORESULT",
}

export enum GAME_PROGRESS {
  INPROGRESS = "INPROGRESS",
  ABANDONED = "ABANDONED",
  FINISHED = "FINISHED",
  TIMEUP = "TIMEUP",
  PLAYEREXIT = "PLAYEREXIT",
}

export const PLAYER_TIME = "player_time";
export const INIT_GAME: string = "init_game";
export const MOVE: string = "move";
export const RESIGN: string = "resign";
export const DRAW: string = "draw";
export const OFFER_DRAW: string = "offer_draw";
export const ACCEPT_DRAW: string = "accept_draw";
export const DECLINE_DRAW: string = "decline_draw";
export const WAITING: string = "waiting";
export const INVALID_MOVE: string = "invalid_move";
export const GAME_OVER: string = "game_over";
export const JOIN_GAME: string = "join_game";
export const IN_PROGRESS: string = "in_progress";
export const NO_PLAYER_AVAILABLE: string = "no_player_available";
export const PLAYERS_ONLINE: string = "players_online";
