import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";

const BotGame = () => {
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePostion] = useState<string>(game.fen());

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setGamePostion(game.fen());

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
};

export default BotGame;
