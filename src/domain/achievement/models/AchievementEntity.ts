export interface Achievement {
    id: string;
    achievement_name: string;
    icon: string;
    price: number;
    isUnlocked: boolean;
}

export class AchievementsEntity {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly achievements: Achievement[]
    ) {}
}