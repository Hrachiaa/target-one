-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Week" DROP CONSTRAINT "Week_planId_fkey";

-- CreateTable
CREATE TABLE "Achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AchievementItem" (
    "id" TEXT NOT NULL,
    "achievementName" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "achievementsId" TEXT NOT NULL,

    CONSTRAINT "AchievementItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Achievements_userId_key" ON "Achievements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementItem_achievementsId_key" ON "AchievementItem"("achievementsId");

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AchievementItem" ADD CONSTRAINT "AchievementItem_achievementsId_fkey" FOREIGN KEY ("achievementsId") REFERENCES "Achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
