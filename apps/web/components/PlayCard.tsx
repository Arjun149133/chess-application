"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { INIT_GAME } from "@lib/messages";
import LoadingSpinner from "./LoadingSpinner";

const PlayCard = ({
  socket,
  loading,
  message,
}: {
  socket?: WebSocket | null;
  loading: boolean;
  message?: string;
}) => {
  const [gameType, setGameType] = useState("CLASSICAL");
  const [tokenLoading, setTokenLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    setTokenLoading(true);
    const token = localStorage.getItem("chessToken");
    if (token) {
      setToken(token);
    }

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
            {!token ? (
              <div className=" flex justify-center items-center text-red-400 text-xl">
                Login to continue
              </div>
            ) : (
              <>
                <div>
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
                  {message && (
                    <div className=" text-red-400 text-center">{message}</div>
                  )}
                </div>
                <div>
                  {loading ? (
                    <div className=" lg:hidden flex w-full items-center justify-center animate-pulse text-yellow-200 mt-2">
                      <span>Searching for a player</span>
                    </div>
                  ) : null}{" "}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PlayCard;
