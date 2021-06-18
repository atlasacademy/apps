export const getTimeString = (timestampSecond: number) => {
    return new Date(timestampSecond * 1000).toLocaleString();
};
