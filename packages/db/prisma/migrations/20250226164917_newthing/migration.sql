/*
  Warnings:

  - The values [InProgress,Abandoned,Finished,TimeUp,PlayerExit] on the enum `GameProgress` will be removed. If these variants are still used in the database, this will fail.
  - The values [Bullet,Blitz,Rapid,Classical] on the enum `GameTime` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameProgress_new" AS ENUM ('INPROGRESS', 'ABANDONED', 'FINISHED', 'TIMEUP', 'PLAYEREXIT');
ALTER TABLE "Game" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "Game" ALTER COLUMN "progress" TYPE "GameProgress_new" USING ("progress"::text::"GameProgress_new");
ALTER TYPE "GameProgress" RENAME TO "GameProgress_old";
ALTER TYPE "GameProgress_new" RENAME TO "GameProgress";
DROP TYPE "GameProgress_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "GameTime_new" AS ENUM ('BULLET', 'BLITZ', 'RAPID', 'CLASSICAL');
ALTER TABLE "Game" ALTER COLUMN "time" TYPE "GameTime_new" USING ("time"::text::"GameTime_new");
ALTER TYPE "GameTime" RENAME TO "GameTime_old";
ALTER TYPE "GameTime_new" RENAME TO "GameTime";
DROP TYPE "GameTime_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "progress" DROP DEFAULT;
