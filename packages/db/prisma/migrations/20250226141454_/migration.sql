-- AlterEnum
ALTER TYPE "GameResult" ADD VALUE 'NoResult';

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "progress" SET DEFAULT 'InProgress';
