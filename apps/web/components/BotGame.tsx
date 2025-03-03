"use client";
import { Chess, Square } from "chess.js";
import { Engine } from "engine/Engine";
import { useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";

const BotGame = () => {
  const levels = {
    Easy: 2,
    Medium: 8,
    Hard: 18,
  };

  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);

  useEffect(() => {
    const findBestMove = () => {
      engine.evaluatePosition(game.fen(), stockfishLevel);

      engine.onMessage(({ bestMove }) => {
        if (bestMove) {
          game.move({
            from: bestMove.substring(0, 2),
            to: bestMove.substring(2, 4),
            promotion: bestMove.substring(4, 5),
          });
          setGamePosition(game.fen()); // Update game position
        }
      });
    };

    if (game.isGameOver() === false) {
      findBestMove();
    }
  }, [game, stockfishLevel, engine]);

  const onDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    setGamePosition(game.fen());

    if (move === null || game.isGameOver() || game.isDraw()) return false;

    return true;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(levels).map(([level, depth]) => (
          <button
            key={level}
            style={{
              backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
            }}
            onClick={() => setStockfishLevel(depth)}
          >
            {level}
          </button>
        ))}
      </div>

      <Chessboard
        id="PlayVsStockfish"
        position={gamePosition}
        onPieceDrop={onDrop}
      />

      <button
        onClick={() => {
          game.reset();
          setGamePosition(game.fen());
        }}
      >
        New game
      </button>
      <button
        onClick={() => {
          game.undo();
          game.undo();
          setGamePosition(game.fen());
        }}
      >
        Undo
      </button>
    </div>
  );
};

export default BotGame;
