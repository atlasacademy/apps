import useWindowDimensions from "./useWindowDimensions";

const getSceneScale = (windowWidth: number, windowHeight: number, wideScreen: boolean) => {
    if (wideScreen) {
        if (windowWidth < 768) {
            return 4;
        } else if (windowWidth <= 1024) {
            return 2.5;
        }
    }
    if (windowWidth < 768) {
        return 3;
    }
    return 2;
};

export function useImageSize(wideScreen: boolean) {
    const { windowWidth, windowHeight } = useWindowDimensions(),
        sceneScale = getSceneScale(windowWidth, windowHeight, wideScreen),
        height = (wideScreen ? 576 : 576) / sceneScale,
        width = (wideScreen ? 1344 : 1024) / sceneScale;
    return { height, width };
}
