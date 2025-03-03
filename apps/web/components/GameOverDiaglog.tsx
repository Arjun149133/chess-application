import Button from "./Button";

const GameOverDiaglog = ({
  setGameOverDiaglog,
  gameOver,
}: {
  setGameOverDiaglog: (value: boolean) => void;
  gameOver: {
    winnerUsername: string;
    result: string;
    progress: string;
  };
}) => {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black/50">
      <div className="bg-primary relative rounded-2xl w-[500px] h-[500px] flex flex-col justify-center items-center space-y-2 p-6">
        <Button
          className="absolute top-4 right-4"
          onClick={() => setGameOverDiaglog(false)}
        >
          <span>X</span>
        </Button>
        <h1 className="text-4xl font-bold">Game Over</h1>
        <h2 className="text-xl font-bold">Winner: {gameOver.winnerUsername}</h2>
        <h2 className="text-xl font-bold">Result: {gameOver.result}</h2>
        <h4 className="text-xl font-bold">Progress: {gameOver.progress}</h4>
        <Button className="mt-4">Play Again</Button>
      </div>
    </div>
  );
};

export default GameOverDiaglog;
