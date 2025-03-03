import { getGameFromDb } from "@lib/getGame";
import { useEffect, useState } from "react";

const useGameFromDb = (gameId: string) => {
  const [blackPlayerUserName, setBlackPlayerUserName] = useState("");
  const [whitePlayerUserName, setWhitePlayerUserName] = useState("");

  useEffect(() => {
    const game = getGameFromDb(gameId);
    game
      .then((data) => {
        setBlackPlayerUserName(data.game.blackPlayer.username);
        setWhitePlayerUserName(data.game.whitePlayer.username);
      })
      .catch((error) => {});
  }, []);

  return {
    blackPlayerUserName,
    whitePlayerUserName,
  };
};

export default useGameFromDb;
