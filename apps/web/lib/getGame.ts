import axios from "axios";

export const getGameFromDb = async (gameId: string) => {
  if (!gameId) return;
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/${gameId}`,
    {
      headers: {
        Authorization: `${localStorage.getItem("chessToken")}`,
      },
    }
  );
  return data;
};
