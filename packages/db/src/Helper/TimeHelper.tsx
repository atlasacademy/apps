export const getTimeString = (timestampSecond: number) => {
    return new Date(timestampSecond * 1000).toLocaleString();
};

export const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

export const getEventStatus = (startedAt: number, endedAt: number) => {
    const currentTimestamp = getCurrentTimestamp();
    if (currentTimestamp < startedAt) {
        return "Not started";
    }
    if (currentTimestamp >= startedAt && currentTimestamp <= endedAt) {
        return "Ongoing";
    }
    return "Finished";
};
