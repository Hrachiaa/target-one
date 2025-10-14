type NewAch = {
    achievment_name: string;
    icon: string;
    price: number;
    isUnlocked?: boolean;
};

const DEFAULT_ACHIEVEMENTS: NewAch[] = [
    {
        achievment_name: 'First Login',
        icon: 'https://cdn/first-login.png',
        price: 0,
    },
    {
        achievment_name: 'First Task',
        icon: 'https://cdn/first-task.png',
        price: 20,
    },
    {
        achievment_name: 'Five Tasks',
        icon: 'https://cdn/five-tasks.png',
        price: 40,
    },
    {
        achievment_name: 'Ten Tasks',
        icon: 'https://cdn/ten-tasks.png',
        price: 80,
    },
    {
        achievment_name: 'Streak 3',
        icon: 'https://cdn/streak-3.png',
        price: 160,
    },
    {
        achievment_name: 'Streak 7',
        icon: 'https://cdn/streak-7.png',
        price: 160,
    },
    {
        achievment_name: 'Early Bird',
        icon: 'https://cdn/early-bird.png',
        price: 300,
    },
    {
        achievment_name: 'Night Owl',
        icon: 'https://cdn/night-owl.png',
        price: 300,
    },
    { achievment_name: 'Planner', icon: 'https://cdn/planner.png', price: 300 },
    {
        achievment_name: 'Consistency',
        icon: 'https://cdn/consistency.png',
        price: 500,
    },
    { achievment_name: 'Social', icon: 'https://cdn/social.png', price: 800 },
    {
        achievment_name: 'Collector',
        icon: 'https://cdn/collector.png',
        price: 1000,
    },
];

export default DEFAULT_ACHIEVEMENTS;
