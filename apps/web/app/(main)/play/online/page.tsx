"use client";
import LoadingSpinner from "@components/LoadingSpinner";
import PlayCard from "@components/PlayCard";
import { ProfileCard } from "@components/ProfileCard";
import useSocket from "@hooks/useSocket";
import { INIT_GAME, WAITING } from "@lib/messages";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OnlinePage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === WAITING) {
        setLoading(true);
      }

      if (data.type === INIT_GAME) {
        console.log("Game Started");
        router.push(`/play/online/${data.payload.gameId}`);
        setLoading(false);
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
      </div>
      <div className="flex w-1/2 justify-center items-center h-screen">
        <PlayCard socket={socket} loading={loading} />
      </div>
    </div>
  );
};

export default OnlinePage;
