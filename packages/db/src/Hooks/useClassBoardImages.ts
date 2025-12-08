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
        let canceled = false;

        if (!classBoard?.squares) {
            setSquareImages(new Map());
            setImagesLoaded(true);
            return;
        }

        const squaresWithImages: ClassBoard.ClassBoardSquare[] = classBoard.squares.filter(
            (square): square is ClassBoard.ClassBoardSquare => Boolean(square.icon || square.lock?.items?.[0]?.item?.icon)
        );

        if (squaresWithImages.length === 0) {
            setSquareImages(new Map());
            setImagesLoaded(true);
            return;
        }

        setImagesLoaded(false);
        // Clear previous icons so placeholders render while new ones load
        setSquareImages(new Map());

        const loadSquareImage = (square: ClassBoard.ClassBoardSquare) => new Promise<{ id: number; cache?: CachedImage }>((resolve) => {
            const imageSrc = square.lock ? square.lock.items?.[0]?.item?.icon : square.icon;

            if (!imageSrc) {
                resolve({ id: square.id });
                return;
            }

            const img = new Image();
            
            img.crossOrigin = "anonymous";

            img.onload = () => {
                resolve({
                    id: square.id,
                    cache: {
                        img,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    },
                });
            };

            img.onerror = () => {
                resolve({ id: square.id });
            };

            img.src = imageSrc;
        });

        const loadAll = async () => {
            try {
                const results = await Promise.all(squaresWithImages.map(loadSquareImage));
                if (canceled) return;

                const map = new Map<number, CachedImage>();
                results.forEach((result) => {
                    if (result.cache) {
                        map.set(result.id, result.cache);
                    }
                });
                setSquareImages(map);
            } finally {
                if (!canceled) {
                    setImagesLoaded(true);
                }
            }
        };

        loadAll();

        return () => {
            canceled = true;
        };
    }, [classBoard]);

    return {
        squareImages,
        imagesLoaded
    };
};
