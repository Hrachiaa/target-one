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
    toEntity(achiev: AchievementsDocument): AchievementsEntity{
        return new AchievementsEntity(achiev._id.toString(), achiev.userId, achiev.achievements.map(mapAchievement))
    }
    toDB(user: AchievementsEntity): undefined{
        return
    }
}

export const mapper = new UserMapper()