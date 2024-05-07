import { useEffect, useState } from "react";

export const getCurrentPosition = () => {
    const scrollLimit =
        Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        ) - window.innerHeight;
    const scrollPosition = window.scrollY;
    if (scrollLimit === 0) return 0;
    return scrollPosition / scrollLimit;
};

/**
 * Return current scroll position from 0 to 1
 */
const useScroll = () => {
    const [scrollPosition, setScrollPosition] = useState(getCurrentPosition());

    useEffect(() => {
        const scroll = () => {
            setScrollPosition(getCurrentPosition());
        };
        document.addEventListener("scroll", scroll);

        return () => document.removeEventListener("scroll", scroll);
    }, []);

    return scrollPosition;
};

export default useScroll;
