import { AchievementItem, AchievementsEntity } from "../../../../domain/achievement/models/AchievementEntity";
import { AchievementItemDocument, AchievementsDocument } from "./PostgresAchievementRepository";

interface DBMapper<T> {
    toEntity(AchievementsDocument: AchievementsDocument): AchievementsEntity;
    toDB(AchievementsEntity: AchievementsEntity): T
    toItemEntity(item: AchievementItemDocument): AchievementItem
}

const mapAchievement = (
        doc: AchievementItemDocument
    ): AchievementItem => ({
        id: doc.id,
        achievementName: doc.achievementName,
        icon: doc.icon,
        price: doc.price,
        isUnlocked: doc.isUnlocked,
    })

class UserMapper implements DBMapper<undefined> {
    toEntity(achieve: AchievementsDocument): AchievementsEntity{
        return new AchievementsEntity(achieve.id, achieve.userId, achieve.achievements.map(mapAchievement))
    }
    toDB(achieve: AchievementsEntity): undefined{
        return
    }
    toItemEntity(item: AchievementItemDocument): AchievementItem {
        return mapAchievement(item)
    }
}

export const mapper = new UserMapper()