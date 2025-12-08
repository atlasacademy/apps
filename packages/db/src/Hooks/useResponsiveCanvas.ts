import { useEffect, useRef, useState, useCallback } from "react";

interface UseResponsiveCanvasOptions {
    baseWidth?: number;
    baseHeight?: number;
}

/**
 * Custom hook for responsive canvas sizing
 * Manages canvas dimensions based on container size while maintaining aspect ratio
 */
export const useResponsiveCanvas = (options: UseResponsiveCanvasOptions = {}) => {
    const { baseWidth = 1100, baseHeight = 700 } = options;
    const [canvasSize, setCanvasSize] = useState({ width: baseWidth, height: baseHeight });
    const containerRef = useRef<HTMLDivElement>(null);

    /**
     * Calculate canvas size based on container dimensions
     * Maintains the aspect ratio while fitting within container
     */
    const updateCanvasSize = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerHeight = Math.max(400, rect.height);

            // Maintain aspect ratio
            const aspectRatio = baseWidth / baseHeight;
            let width = containerWidth;
            let height = width / aspectRatio;

            // If height exceeds container, scale down
            if (height > containerHeight) {
                height = containerHeight;
                width = height * aspectRatio;
            }

            setCanvasSize({ width, height });
        }
    }, [baseWidth, baseHeight]);

    /**
     * Set up resize observer and listener on component mount
     * Updates canvas size on window resize events
     */
    useEffect(() => {
        // Initial size calculation
        updateCanvasSize();

        try {
            // Create resize observer for container
            const resizeObserver = new ResizeObserver(() => {
                updateCanvasSize();
            });

            if (containerRef.current) {
                resizeObserver.observe(containerRef.current);
            }

            // Also listen to window resize as fallback
            const handleWindowResize = () => {
                updateCanvasSize();
            };

            window.addEventListener("resize", handleWindowResize);

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener("resize", handleWindowResize);
            };
        } catch (e) {
            // ResizeObserver not supported, fallback to window resize only
            window.addEventListener("resize", updateCanvasSize);
            
            return () => {
                window.removeEventListener("resize", updateCanvasSize);
            };
        }
    }, [updateCanvasSize]);

    return {
        containerRef,
        canvasSize,
        updateCanvasSize
    };
};
