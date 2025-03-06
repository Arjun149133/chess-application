"use client";
import BotGame from "@components/BotGame";
import React from "react";

const BotPage = () => {
  return (
    <div className=" flex ">
      <div className="flex flex-col w-1/2 justify-center items-center h-screen">
        <div>
          <BotGame />
        </div>
      </div>
      <div className="flex w-1/2 justify-center items-center h-screen">
        HISTORY
      </div>
    </div>
  );
};

export default BotPage;
