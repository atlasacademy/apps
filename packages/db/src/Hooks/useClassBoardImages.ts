import { ClassBoard } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";

interface CachedImage {
    img: HTMLImageElement;
    width: number;
    height: number;
}

interface UseClassBoardImagesOptions {
    classBoard?: ClassBoard.ClassBoard;
}

/**
 * Custom hook for loading and caching ClassBoard square images
 * Handles image loading with cross-origin support and caching
 */
export const useClassBoardImages = (options: UseClassBoardImagesOptions) => {
    const { classBoard } = options;
    const [squareImages, setSquareImages] = useState<Map<number, CachedImage>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        if (!classBoard?.squares) {
            setImagesLoaded(true);
            return;
        }

        const imageMap = new Map<number, CachedImage>();
        let loadedCount = 0;

        // Filter squares that have images to load
        const squaresWithImages = classBoard.squares.filter(
            (s: any) => s.lock ? s.lock.items[0]?.item.icon : s.icon
        );

        if (squaresWithImages.length === 0) {
            setSquareImages(imageMap);
            setImagesLoaded(true);
            return;
        }

        /**
         * Load image for a specific square
         */
        squaresWithImages.forEach((square: any) => {
            const imageSrc = square.lock ? square.lock.items[0]?.item.icon : square.icon;
            
            if (!imageSrc) {
                loadedCount++;
                if (loadedCount === squaresWithImages.length) {
                    setSquareImages(new Map(imageMap));
                    setImagesLoaded(true);
                }
                return;
            }

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageSrc;

            /**
             * Handle successful image load
             */
            img.onload = () => {
                imageMap.set(square.id, {
                    img,
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
                loadedCount++;
                
                if (loadedCount === squaresWithImages.length) {
                    setSquareImages(new Map(imageMap));
                    setImagesLoaded(true);
                }
            };

            /**
             * Handle image load error
             */
            img.onerror = () => {
                // eslint-disable-next-line no-console
                console.warn(`Failed to load image for square ${square.id}`);
                loadedCount++;
                
                if (loadedCount === squaresWithImages.length) {
                    setSquareImages(new Map(imageMap));
                    setImagesLoaded(true);
                }
            };
        });
    }, [classBoard]);

    return {
        squareImages,
        imagesLoaded
    };
};
