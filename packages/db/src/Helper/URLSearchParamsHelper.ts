export const getNumParam = (searchParams: URLSearchParams, param: string) => {
    const num = searchParams.get(param);
    if (num !== null) {
        try {
            return parseInt(num);
        } catch {}
    }
    return undefined;
};
