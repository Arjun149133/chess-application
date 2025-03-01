"use client";
import OnlineGameBoard from "@components/OnlineGame";
import { ProfileCard } from "@components/ProfileCard";
import useSocket from "@hooks/useSocket";
import { getGameFromDb } from "@lib/getGame";
import { JOIN_GAME } from "@lib/messages";
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

  useEffect(() => {
    if (!pathname) return;

    const path = pathname.split("/");
    setGameId(path[path.length - 1]!);
  }, [pathname]);

  useEffect(() => {
    const localToken = localStorage.getItem("chessToken");
    if (!localToken) return;

    setToken(localToken);
    const decodedToken = jwt.decode(localToken) as {
      username: string;
      userId: string;
    };
    setUsername(decodedToken.username);

    socket?.send(
      JSON.stringify({
        type: JOIN_GAME,
        payload: {
          gameId: gameId,
        },
      })
    );

    const game = getGameFromDb(gameId);
    game
      .then((data) => {
        setBlackPlayerUserName(data.game.blackPlayer.username);
        setWhitePlayerUserName(data.game.whitePlayer.username);
      })
      .catch((error) => {});
  }, [token, gameId]);

  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    };
  }, [socket]);

  return (
    <div className=" flex ">
      <div className="flex flex-col w-1/2 justify-center items-center h-screen">
        <div className=" w-[500px]">
          <ProfileCard username={blackPlayerUserName} />
        </div>
        <div>
          <OnlineGameBoard />
        </div>
        <div className=" w-[500px]">
          <ProfileCard username={whitePlayerUserName} />
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center h-screen">
        HISTORY
      </div>
    </div>
  );
};

export default GamePage;
