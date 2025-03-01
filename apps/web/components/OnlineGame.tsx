import { useMemo, useState } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function OnlineGameBoard() {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePostion] = useState(game.fen());

  function makeRandomMove(): void {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]!);
    setGamePostion(game.fen());
  }

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    console.log("sourceSquare", sourceSquare, targetSquare);
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    } as Move;

    if (move === null) return false;
    game.move(move);
    setGamePostion(game.fen());
    console.log("game.fen()", game.fen());
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return (
    <div>
      <Chessboard
        position={gamePosition}
        onPieceDrop={onDrop}
        boardWidth={500}
      />
    </div>
  );
}
