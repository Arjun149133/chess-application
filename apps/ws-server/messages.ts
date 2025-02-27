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
