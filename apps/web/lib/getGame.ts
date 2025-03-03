import axios from "axios";
import { BACKEND_URL } from "./config";

export const getGameFromDb = async (gameId: string) => {
  if (!gameId) return;
  const { data } = await axios.get(`${BACKEND_URL}/api/game/${gameId}`, {
    headers: {
      Authorization: `${localStorage.getItem("chessToken")}`,
    },
  });
  return data;
};
