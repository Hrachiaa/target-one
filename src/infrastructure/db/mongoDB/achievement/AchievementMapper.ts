import { Achievement, AchievementsEntity } from "../../../../domain/achievement/models/AchievementEntity";
import { AchievementDocument, AchievementsDocument } from "./AchievementModel";

interface DBMapper<T> {
    toEntity(AchievementsDocument: AchievementsDocument): AchievementsEntity;
    toDB(AchievementsEntity: AchievementsEntity): T
}

const mapAchievement = (
        doc: AchievementDocument
    ): Achievement => ({
        id: doc._id.toString(),
        achievement_name: doc.achievement_name,
        icon: doc.icon,
        price: doc.price,
        isUnlocked: doc.isUnlocked,
    })

class UserMapper implements DBMapper<undefined> {
    toEntity(achieve: AchievementsDocument): AchievementsEntity{
        return new AchievementsEntity(achieve._id.toString(), achieve.userId, achieve.achievements.map(mapAchievement))
    }
    toDB(achieve: AchievementsEntity): undefined{
        return
    }
}

export const mapper = new UserMapper()