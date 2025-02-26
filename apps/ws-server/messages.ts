export enum GAME_TYPE {
  CLASSICAL = "CLASSICAL",
  BLITZ = "BLITZ",
  RAPID = "RAPID",
  BULLET = "BULLET",
}
export const INIT_GAME: string = "init_game";
export const MOVE: string = "move";
export const RESIGN: string = "resign";
export const OFFER_DRAW: string = "offer_draw";
export const ACCEPT_DRAW: string = "accept_draw";
export const DECLINE_DRAW: string = "decline_draw";
