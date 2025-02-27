-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "blackPlayerTimeRemaining" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "whitePlayerTimeRemaining" INTEGER NOT NULL DEFAULT 0;
