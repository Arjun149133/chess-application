"use client";
import LoadingSpinner from "@components/LoadingSpinner";
import PlayCard from "@components/PlayCard";
import { ProfileCard } from "@components/ProfileCard";
import useSocket from "@hooks/useSocket";
import {
  INIT_GAME,
  NO_PLAYER_AVAILABLE,
  PLAYERS_ONLINE,
  WAITING,
} from "@lib/messages";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OnlinePage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [playersOnline, setPlayersOnline] = useState(0);
  const router = useRouter();
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === PLAYERS_ONLINE) {
        setPlayersOnline(data.payload.playersOnline);
      }

      if (data.type === WAITING) {
        setLoading(true);
      }

      if (data.type === INIT_GAME) {
        router.push(`/play/online/${data.payload.gameId}`);
        setLoading(false);
      }

      if (data.type === NO_PLAYER_AVAILABLE) {
        setLoading(false);
        setMessage("No player available at the moment, Please try again later");
      }
    };
  }, [socket]);

  return (
    <div className=" flex ">
      <div className="flex flex-col w-1/2 justify-center items-center h-screen">
        <div className=" w-[500px]">
          <ProfileCard username="Opponent" />
        </div>
        <div
          className={`${loading ? "animate-pulse brightness-75" : ""} relative`}
        >
          <Image src="/chessboard.png" alt="chess" width={500} height={500} />
          {loading && (
            <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
              <span className=" text-black text-lg">
                Searching for Other Player...
              </span>
              <div className=" flex justify-center items-center">
                <LoadingSpinner />
              </div>
            </div>
          )}
        </div>
        <div className=" w-[500px]">
          <ProfileCard username="You" />
        </div>
        {playersOnline > 0 && (
          <div className="">
            <span className=" text-green-500 text-lg">
              Players Online: {playersOnline}
            </span>
          </div>
        )}
      </div>
      <div className="flex w-1/2 justify-center items-center h-screen">
        <PlayCard socket={socket} loading={loading} message={message} />
      </div>
    </div>
  );
};

export default OnlinePage;
