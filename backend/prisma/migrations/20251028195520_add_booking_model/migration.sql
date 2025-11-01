/*
  Warnings:

  - You are about to drop the `Promo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Slot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `amountCents` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `promoCode` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `slotId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Experience` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Experience` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Promo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Slot";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "experienceId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "experienceId", "id") SELECT "createdAt", "experienceId", "id" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Experience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Experience" ("createdAt", "description", "id", "imageUrl", "priceCents", "slug", "title") SELECT "createdAt", "description", "id", "imageUrl", "priceCents", "slug", "title" FROM "Experience";
DROP TABLE "Experience";
ALTER TABLE "new_Experience" RENAME TO "Experience";
CREATE UNIQUE INDEX "Experience_slug_key" ON "Experience"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
