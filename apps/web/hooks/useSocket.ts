import { WS_URL as WS } from "@lib/config";
import { useEffect, useState } from "react";

const useSocket = () => {
  const WS_URL = WS + "?token=";
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("chessToken") || "");
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = new WebSocket(WS_URL + token);

    socket.onopen = () => {
      setSocket(socket);
    };

    socket.onclose = () => {
      setSocket(null);
    };

    return () => {
      socket.close();
      setSocket(null);
    };
  }, [token]);

  return socket;
};

export default useSocket;
