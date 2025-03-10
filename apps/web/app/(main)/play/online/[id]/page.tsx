"use client";
import Button from "@components/Button";
import LoadingSpinner from "@components/LoadingSpinner";
import OnlineGameBoard from "@components/OnlineGame";
import useSocket from "@hooks/useSocket";
import {
  DRAW,
  GAME_OVER,
  IN_PROGRESS,
  JOIN_GAME,
  OFFER_DRAW,
  RESIGN,
} from "@lib/messages";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GamePage = () => {
  const [gameId, setGameId] = useState("");
  const socket = useSocket();
  const pathname = usePathname();
  const [blackPlayerUserName, setBlackPlayerUserName] = useState("");
  const [whitePlayerUserName, setWhitePlayerUserName] = useState("");
  const [gameFen, setGameFen] = useState("");
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory]);

  useEffect(() => {
    if (!pathname) return;

    const path = pathname.split("/");
    setGameId(path[path.length - 1]!);
  }, [pathname]);

  useEffect(() => {
    if (!socket) return;

    const localToken = localStorage.getItem("chessToken");
    if (!localToken) return;

    socket.send(
      JSON.stringify({
        type: JOIN_GAME,
        payload: {
          gameId: gameId,
        },
      })
    );
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === IN_PROGRESS) {
        setBlackPlayerUserName(data.payload.blackPlayer);
        setWhitePlayerUserName(data.payload.whitePlayer);
        setGameFen(data.payload.currentFen);
        setMoveHistory(data.payload.moveHistory ?? []);
      }

      if (data.type === GAME_OVER) {
        setBlackPlayerUserName(data.payload.blackPlayer);
        setWhitePlayerUserName(data.payload.whitePlayer);
        setGameFen(data.payload.currentFen);
      }
    };
  }, [socket]);

  if (!gameFen)
    return (
      <div className=" flex w-full h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className=" flex flex-col lg:flex-row ">
      <div className="flex flex-col lg:w-1/2 justify-center items-center h-screen">
        <div>
          <OnlineGameBoard
            gameId={gameId}
            socket={socket}
            whitePlayerUserName={whitePlayerUserName}
            blackPlayerUserName={blackPlayerUserName}
            gameFen={gameFen}
            setMoveHistory={setMoveHistory}
          />
        </div>
      </div>
      <div className="flex flex-col lg:w-1/2 justify-center items-center h-screen bg-secondary">
        <div className=" flex flex-col justify-between bg-primary rounded-xl w-1/2 h-1/2 p-2">
          <div className="flex flex-col h-[80%]">
            <h1 className=" flex justify-center items-center text-lg font-bold">
              History
            </h1>
            <div
              className=" flex flex-col p-2 overflow-y-auto h-full"
              ref={scrollRef}
            >
              {moveHistory.map((move, index) => {
                const isWhiteMove = index % 2 === 0;

                return (
                  <div key={index} className={` grid grid-cols-2`}>
                    {isWhiteMove ? (
                      <>
                        <div className="m-2 rounded-lg p-1 flex justify-center items-center">
                          {move}
                        </div>
                        {moveHistory[index + 1] && (
                          <div className=" m-2 bg-secondary rounded-lg p-1 flex justify-center items-center">
                            {moveHistory[index + 1]}
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className=" flex justify-center items-center space-x-2">
            <Button
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: RESIGN,
                    payload: {
                      gameId: gameId,
                    },
                  })
                );
              }}
            >
              Resign
            </Button>
            <Button
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: DRAW,
                    payload: {
                      gameId: gameId,
                      action: OFFER_DRAW,
                    },
                  })
                );
              }}
            >
              Offer Draw
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
