import { client } from "@repo/db/client";
import { Router } from "express";
import authMiddleware from "../middleware/auth";

const router = Router();

router.get("/playedgames", authMiddleware, async (req, res) => {
  try {
    const games = await client.game.findMany({
      where: {
        whitePlayerId: req.user.userId,
        blackPlayerId: req.user.userId,
      },
    });

    res.json({
      playedGames: games,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/game/:gameId", authMiddleware, async (req, res) => {
  try {
    const game = await client.game.findUnique({
      where: {
        id: req.params.gameId,
      },
    });

    if (!game) {
      res.status(404).send("Game not found");
      return;
    }

    res.json({
      game,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
