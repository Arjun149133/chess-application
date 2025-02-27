import type { Chess, Square } from "chess.js";
import type { GAME_TYPE } from "./messages";

export function returnsTime(game_type: GAME_TYPE): number {
  switch (game_type) {
    case "CLASSICAL":
      return 10 * 60 * 1000;
    case "BLITZ":
      return 3 * 60 * 1000;
    case "RAPID":
      return 5 * 60 * 1000;
    case "BULLET":
      return 1 * 60 * 1000;
    default:
      return 5 * 60 * 1000;
  }
}

export function isPromoting(chess: Chess, from: Square, to: Square) {
  if (!from) return false;

  const piece = chess.get(from);

  if (!piece) return false;

  // Ensure the piece is a pawn and it's the correct player's turn
  if (piece.type !== "p") return false;
  if (piece.color !== chess.turn()) return false;

  // Ensure the destination square is in the promotion rank (1st or 8th)
  const promotionRank = piece.color === "w" ? "8" : "1"; // White promotes to 8th rank, Black to 1st rank
  if (!to.endsWith(promotionRank)) return false;

  // Check if the move is valid and is a promotion move
  const validMoves = chess.moves({ square: from, verbose: true });
  return validMoves.some((move) => move.to === to && move.promotion);
}
