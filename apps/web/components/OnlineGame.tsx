"use client";
import { useEffect, useMemo, useState } from "react";
import { Chess, Move } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  ACCEPT_DRAW,
  DECLINE_DRAW,
  DRAW,
  GAME_OVER,
  MOVE,
  OFFER_DRAW,
  PLAYER_TIME,
} from "@lib/messages";
import useToken from "@hooks/useToken";
import { ProfileCard } from "./ProfileCard";
import GameOverDiaglog from "./GameOverDiaglog";

export default function OnlineGameBoard({
  gameId,
  whitePlayerUserName,
  blackPlayerUserName,
  socket,
  gameFen,
  setMoveHistory,
}: {
  gameId: string;
  whitePlayerUserName: string;
  blackPlayerUserName: string;
  socket: WebSocket | null;
  gameFen: string;
  setMoveHistory: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const game = useMemo(() => new Chess(gameFen), []);
  const [gamePosition, setGamePostion] = useState<string>(gameFen);
  const { username } = useToken();
  const [timer, setTimer] = useState({
    whitePlayerTimeRemaining: 0,
    blackPlayerTimeRemaining: 0,
  });
  const [gameOverDiaglog, setGameOverDiaglog] = useState(false);
  const [gameOver, setGameOver] = useState({
    winnerUsername: "",
    result: "",
    progress: "",
  });
  const [drawOffered, setDrawOffered] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case MOVE:
          const move = message.payload.move;
          setMoveHistory((prev) => [...prev, message.payload.san]);

          if (game.get(move.from) === undefined) {
            break;
          }

          game.move({
            from: move.from,
            to: move.to,
            promotion: "q",
          });
          setGamePostion(game.fen());
          break;

        case PLAYER_TIME:
          setTimer({
            whitePlayerTimeRemaining: message.payload.whitePlayerTimeRemaining,
            blackPlayerTimeRemaining: message.payload.blackPlayerTimeRemaining,
          });
          break;

        case GAME_OVER:
          setGameOver({
            winnerUsername: message.payload.winner,
            result: message.payload.result,
            progress: message.payload.progress,
          });
          setGameOverDiaglog(true);
          break;

        case DRAW:
          if (message.payload.action === OFFER_DRAW) {
            setDrawOffered(true);
          }
          break;

        default:
          break;
      }
    };
  }, [socket]);

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    try {
      if (!socket) return false;

      if (game.turn() === "w" && username !== whitePlayerUserName) {
        return false;
      }
      if (game.turn() === "b" && username !== blackPlayerUserName) {
        return false;
      }

      const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for example simplicity
      } as Move;
      game.move(move);
      setGamePostion(game.fen());

      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            gameId: gameId,
            move: {
              from: sourceSquare,
              to: targetSquare,
              promotion: "q",
            },
          },
        })
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <div className=" relative">
      {gameOverDiaglog && (
        <GameOverDiaglog
          setGameOverDiaglog={setGameOverDiaglog}
          gameOver={gameOver}
        />
      )}
      {drawOffered && (
        <div className=" absolute top-0 left-1/2 -translate-x-1/2 bg-secondary/50 p-2 rounded-lg">
          <span>Draw?</span>
          <div className=" flex justify-center items-center">
            <button
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: DRAW,
                    payload: {
                      gameId: gameId,
                      action: ACCEPT_DRAW,
                    },
                  })
                );
                setDrawOffered(false);
              }}
              className=" bg-green-500 text-white px-4 py-1 m-2 rounded cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: DRAW,
                    payload: {
                      gameId: gameId,
                      action: DECLINE_DRAW,
                    },
                  })
                );
                setDrawOffered(false);
              }}
              className=" bg-red-500 text-white px-4 py-1 m-2 rounded cursor-pointer"
            >
              Decline
            </button>
          </div>
        </div>
      )}
      <div className=" w-[500px]">
        <ProfileCard
          username={
            username === whitePlayerUserName
              ? blackPlayerUserName
              : whitePlayerUserName
          }
          time={
            username === whitePlayerUserName
              ? timer.blackPlayerTimeRemaining
              : timer.whitePlayerTimeRemaining
          }
        />
      </div>
      <Chessboard
        position={gamePosition}
        onPieceDrop={onDrop}
        boardWidth={500}
        boardOrientation={whitePlayerUserName === username ? "white" : "black"}
      />
      <div className=" w-[500px]">
        <ProfileCard
          username={
            username === whitePlayerUserName
              ? whitePlayerUserName
              : blackPlayerUserName
          }
          time={
            username === whitePlayerUserName
              ? timer.whitePlayerTimeRemaining
              : timer.blackPlayerTimeRemaining
          }
        />
      </div>
    </div>
  );
}
