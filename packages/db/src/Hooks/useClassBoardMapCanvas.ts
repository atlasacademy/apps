import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback, useRef, useEffect } from "react";

interface CachedImage {
    img: HTMLImageElement;
    width: number;
    height: number;
}

interface UseClassBoardMapOptions {
    classBoard?: ClassBoard.ClassBoard;
    currentSquare?: ClassBoard.ClassBoardSquare;
    hoveredSquareId: number | null;
    squareImages: Map<number, CachedImage>;
    zoom: number;
    panX: number;
    panY: number;
}

/**
 * Render ClassBoard map onto canvas
 */
export const useClassBoardMapCanvas = (options: UseClassBoardMapOptions) => {
    const {
        classBoard,
        currentSquare,
        hoveredSquareId,
        squareImages,
        zoom,
        panX,
        panY,
    } = options;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    // Create square lookup map for O(1) access
    const squareMap = useRef<Map<number, ClassBoard.ClassBoardSquare>>(new Map());
    
    useEffect(() => {
        if (classBoard?.squares) {
            squareMap.current = new Map(classBoard.squares.map(s => [s.id, s]));
        }
    }, [classBoard]);

    // Draw connecting lines between squares
    const drawLines = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!classBoard) return;

        ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([8, 4]);

        classBoard.lines.forEach((line: ClassBoard.ClassBoardLine) => {
            const prevSquare = squareMap.current.get(line.prevSquareId);
            const nextSquare = squareMap.current.get(line.nextSquareId);

            if (prevSquare && nextSquare) {
                const x1 = (prevSquare.posX / 2) * zoom + canvas.width / 2 + panX;
                const y1 = (-prevSquare.posY / 2) * zoom + canvas.height / 2 + panY;
                const x2 = (nextSquare.posX / 2) * zoom + canvas.width / 2 + panX;
                const y2 = (-nextSquare.posY / 2) * zoom + canvas.height / 2 + panY;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        });

        ctx.setLineDash([]); // Reset dashed lines
    }, [classBoard, zoom, panX, panY]);

    // Draw squares with images
    const drawSquares = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!classBoard) return;

        const size = 35 * zoom;

        classBoard.squares.forEach((square: ClassBoard.ClassBoardSquare) => {
            const x = (square.posX / 2) * zoom + canvas.width / 2 + panX;
            const y = (-square.posY / 2) * zoom + canvas.height / 2 + panY;

            const isSelected = currentSquare?.id === square.id;
            const isHovered = hoveredSquareId === square.id;

            // Square background highlight (only if selected/hovered)
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 215, 100, 0.5)';
                ctx.fillRect(x - size / 2 - 8, y - size / 2 - 8, size + 16, size + 16);
            } else if (isHovered) {
                ctx.fillStyle = 'rgba(100, 150, 255, 0.3)';
                ctx.fillRect(x - size / 2 - 5, y - size / 2 - 5, size + 10, size + 10);
            }

            // Draw square image (no shadow for performance)
            const cachedImage = squareImages.get(square.id);
            if (cachedImage) {
                ctx.drawImage(cachedImage.img, x - size / 2, y - size / 2, size, size);
            } else {
                ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }

            // Square border
            ctx.strokeStyle = isSelected 
                ? '#FFD764' 
                : (isHovered ? '#6496ff' : 'rgba(170, 170, 170, 0.7)');
            ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);

            // Lock indicator (simple red dot)
            if (square.lock) {
                ctx.fillStyle = '#ff6464';
                ctx.beginPath();
                ctx.arc(x + size / 3, y - size / 3, 6 * zoom, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }, [classBoard, squareImages, currentSquare, hoveredSquareId, zoom, panX, panY]);

    // Render canvas with requestAnimationFrame for smooth updates
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw connecting lines
        drawLines(ctx, canvas);

        // Draw squares
        drawSquares(ctx, canvas);
    }, [classBoard, drawLines, drawSquares]);

    useEffect(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(renderCanvas);
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [renderCanvas]);

    return { canvasRef };
};
