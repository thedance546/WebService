export const calculateDate = (baseDate, daysToAdd) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + parseInt(daysToAdd, 10));
    const format = (num) => num.toString().padStart(2, "0");
    return `${date.getFullYear().toString().slice(-2)}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
};