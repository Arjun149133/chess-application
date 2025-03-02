import { useRef } from "react";

const useTimer = () => {
  const timer = useRef({
    whitePlayerTimeRemaining: 0,
    blackPlayerTimeRemaining: 0,
  });

  return timer;
};

export default useTimer;
