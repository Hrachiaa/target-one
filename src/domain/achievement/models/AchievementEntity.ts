export interface AchievementItem {
    id: string;
    achievementName: string;
    icon: string;
    price: number;
    isUnlocked: boolean;
}

export class AchievementsEntity {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly achievements: AchievementItem[]
    ) {}
}