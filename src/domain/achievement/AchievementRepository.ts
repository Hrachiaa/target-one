import { AchievementsEntity } from "./models/AchievementEntity";

export interface AchievementRepositoryInterface {
    createAchievements(userId: string): Promise <AchievementsEntity>;
    findByUserId(userId: string): Promise <AchievementsEntity | null>;
    findIfUnlocked(userId: string, achievementId: string): Promise <AchievementsEntity | null>;
    unlockAchievement(userId: string, achievementId: string): Promise <AchievementsEntity | null>;
    deleteAll(userId: string): Promise <void>;
}