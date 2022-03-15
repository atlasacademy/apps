// https://stackoverflow.com/a/36862446/10241289
import { useState, useEffect } from "react";

function getWindowDimensions() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    return {
        windowWidth,
        windowHeight,
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
