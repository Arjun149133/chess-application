"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { INIT_GAME } from "@lib/messages";
import LoadingSpinner from "./LoadingSpinner";

const PlayCard = ({
  socket,
  loading,
}: {
  socket?: WebSocket | null;
  loading: boolean;
}) => {
  const [gameType, setGameType] = useState("CLASSICAL");
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    setTokenLoading(true);
    const token = localStorage.getItem("chessToken");

    const timer = setTimeout(() => {
      setTokenLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className=" flex flex-col space-y-4 w-1/2 h-1/2 bg-secondary rounded-2xl p-7 ">
      {/* select game time type*/}
      <div>
        <select
          className="bg-primary text-white p-2 rounded-lg w-full cursor-pointer"
          value={gameType}
          onChange={(e) => setGameType(e.target.value)}
        >
          <option value="CLASSICAL">CLASSICAL (10 Min)</option>
          <option value="RAPID">RAPID (5 Min)</option>
          <option value="BLITZ">BLITZ (3 Min) </option>
          <option value="BULLET">BULLET (1 Min) </option>
        </select>
      </div>
      {/* play button */}
      <div className="">
        {tokenLoading ? (
          <div className=" flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {!socket ? (
              <div className=" flex justify-center items-center text-red-400 text-xl">
                Login to continue
              </div>
            ) : (
              <Button
                onClick={() => {
                  socket?.send(
                    JSON.stringify({
                      type: INIT_GAME,
                      payload: {
                        gameType: gameType,
                      },
                    })
                  );
                }}
                className=" w-full"
                disabled={loading}
              >
                <span>Play</span>
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayCard;
