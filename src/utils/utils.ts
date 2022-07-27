export const getCurrentWeekStartDate = () => {
    const now = new Date();
    const diff = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
    const currentWeekStartDate = new Date(now.setDate(diff));
    currentWeekStartDate.setHours(0, 0, 0, 0);
    return currentWeekStartDate;
};

export const getNMonthsAgoDate = (monthsAgo: number) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());
};
