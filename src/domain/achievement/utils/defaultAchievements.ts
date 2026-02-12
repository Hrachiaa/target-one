type NewAch = {
    achievementName: string;
    icon: string;
    price: number;
    isUnlocked?: boolean;
};

const DEFAULT_ACHIEVEMENTS: NewAch[] = [
    {
        achievementName: 'First Login',
        icon: 'https://cdn/first-login.png',
        price: 20,
    },
    {
        achievementName: 'First Task',
        icon: 'https://cdn/first-task.png',
        price: 20,
    },
    {
        achievementName: 'Five Tasks',
        icon: 'https://cdn/five-tasks.png',
        price: 40,
    },
    {
        achievementName: 'Ten Tasks',
        icon: 'https://cdn/ten-tasks.png',
        price: 80,
    },
    {
        achievementName: 'Streak 3',
        icon: 'https://cdn/streak-3.png',
        price: 160,
    },
    {
        achievementName: 'Streak 7',
        icon: 'https://cdn/streak-7.png',
        price: 160,
    },
    {
        achievementName: 'Early Bird',
        icon: 'https://cdn/early-bird.png',
        price: 300,
    },
    {
        achievementName: 'Night Owl',
        icon: 'https://cdn/night-owl.png',
        price: 300,
    },
    { achievementName: 'Planner', icon: 'https://cdn/planner.png', price: 300 },
    {
        achievementName: 'Consistency',
        icon: 'https://cdn/consistency.png',
        price: 500,
    },
    { achievementName: 'Social', icon: 'https://cdn/social.png', price: 800 },
    {
        achievementName: 'Collector',
        icon: 'https://cdn/collector.png',
        price: 1000,
    },
];

export default DEFAULT_ACHIEVEMENTS;
