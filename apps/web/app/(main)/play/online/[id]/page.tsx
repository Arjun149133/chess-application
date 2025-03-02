"use client";
import OnlineGameBoard from "@components/OnlineGame";
import useSocket from "@hooks/useSocket";
import { IN_PROGRESS, JOIN_GAME, PLAYER_TIME } from "@lib/messages";
import jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const GamePage = () => {
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const socket = useSocket();
  const pathname = usePathname();
  const [blackPlayerUserName, setBlackPlayerUserName] = useState("");
  const [whitePlayerUserName, setWhitePlayerUserName] = useState("");
  const [gameFen, setGameFen] = useState("");

  useEffect(() => {
    if (!pathname) return;

    const path = pathname.split("/");
    setGameId(path[path.length - 1]!);
  }, [pathname]);

  useEffect(() => {
    if (!socket) return;

    const localToken = localStorage.getItem("chessToken");
    if (!localToken) return;

    setToken(localToken);
    const decodedToken = jwt.decode(localToken) as {
      username: string;
      userId: string;
    };
    setUsername(decodedToken.username);

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
      console.log("socket not found");
      return;
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === IN_PROGRESS) {
        setBlackPlayerUserName(data.payload.blackPlayer);
        setWhitePlayerUserName(data.payload.whitePlayer);
        setGameFen(data.payload.currentFen);
      }
    };
  }, [socket]);

  if (!gameFen) return <div>Loading...</div>;

  return (
    <div className=" flex ">
      <div className="flex flex-col w-1/2 justify-center items-center h-screen">
        <div>
          <OnlineGameBoard
            gameId={gameId}
            socket={socket}
            whitePlayerUserName={whitePlayerUserName}
            blackPlayerUserName={blackPlayerUserName}
            gameFen={gameFen}
          />
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center h-screen">
        HISTORY
      </div>
    </div>
  );
};

export default GamePage;
