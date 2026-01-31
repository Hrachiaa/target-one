type NewAch = {
    achievement_name: string;
    icon: string;
    price: number;
    isUnlocked?: boolean;
};

const DEFAULT_ACHIEVEMENTS: NewAch[] = [
    {
        achievement_name: 'First Login',
        icon: 'https://cdn/first-login.png',
        price: 20,
    },
    {
        achievement_name: 'First Task',
        icon: 'https://cdn/first-task.png',
        price: 20,
    },
    {
        achievement_name: 'Five Tasks',
        icon: 'https://cdn/five-tasks.png',
        price: 40,
    },
    {
        achievement_name: 'Ten Tasks',
        icon: 'https://cdn/ten-tasks.png',
        price: 80,
    },
    {
        achievement_name: 'Streak 3',
        icon: 'https://cdn/streak-3.png',
        price: 160,
    },
    {
        achievement_name: 'Streak 7',
        icon: 'https://cdn/streak-7.png',
        price: 160,
    },
    {
        achievement_name: 'Early Bird',
        icon: 'https://cdn/early-bird.png',
        price: 300,
    },
    {
        achievement_name: 'Night Owl',
        icon: 'https://cdn/night-owl.png',
        price: 300,
    },
    { achievement_name: 'Planner', icon: 'https://cdn/planner.png', price: 300 },
    {
        achievement_name: 'Consistency',
        icon: 'https://cdn/consistency.png',
        price: 500,
    },
    { achievement_name: 'Social', icon: 'https://cdn/social.png', price: 800 },
    {
        achievement_name: 'Collector',
        icon: 'https://cdn/collector.png',
        price: 1000,
    },
];

export default DEFAULT_ACHIEVEMENTS;
