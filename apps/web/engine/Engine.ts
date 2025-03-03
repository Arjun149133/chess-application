export class Engine {
  stockfish: Worker;
  onMessage: (callback: (arg0: { bestMove: any }) => void) => void;
  sendMessage(arg0: string) {
    this.stockfish.postMessage(arg0);
  }
  constructor() {
    this.stockfish = new Worker("http://localhost:3000/stockfish.js");
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        const bestMove = e.data?.match(/bestmove\s+(\S+)/)?.[1];

        callback({ bestMove });
      });
    };
    // Init engine
    this.sendMessage("uci");
    this.sendMessage("isready");
  }

  evaluatePosition(fen: string, depth: number) {
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {
    this.sendMessage("stop"); // Run when changing positions
  }
  quit() {
    this.sendMessage("quit"); // Good to run this before unmounting.
  }
}
