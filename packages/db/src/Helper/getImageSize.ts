export type Dimension = {
    width: number;
    height: number;
};

export const getImageSize = (url: string): Promise<Dimension> => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.addEventListener("load", () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        });

        img.addEventListener("error", (event) => {
            resolve({ width: -1, height: -1 });
        });

        img.src = url;
    });
};
