import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";

const useToken = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("chessToken") || "");
  }, []);

  useEffect(() => {
    if (!token) return;

    const decodedToken = jwt.decode(token) as {
      username: string;
      userId: string;
    };

    setUsername(decodedToken.username);
    setUserId(decodedToken.userId);
  }, [token]);

  return {
    token,
    username,
    userId,
  };
};

export default useToken;
