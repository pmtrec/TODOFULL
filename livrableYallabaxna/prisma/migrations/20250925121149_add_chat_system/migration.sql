/*
  Warnings:

  - You are about to drop the `chat_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `audioUrl` on the `taskFadil` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "chat_messages";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "taskFadil" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_taskFadil" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameFadil" TEXT NOT NULL,
    "descriptionFadil" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_COURS',
    "imageUrl" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "userId" INTEGER,
    "assignedUserId" INTEGER,
    CONSTRAINT "taskFadil_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "taskFadil_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_taskFadil" ("assignedUserId", "descriptionFadil", "endDate", "id", "imageUrl", "nameFadil", "startDate", "status", "userId") SELECT "assignedUserId", "descriptionFadil", "endDate", "id", "imageUrl", "nameFadil", "startDate", "status", "userId" FROM "taskFadil";
DROP TABLE "taskFadil";
ALTER TABLE "new_taskFadil" RENAME TO "taskFadil";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
