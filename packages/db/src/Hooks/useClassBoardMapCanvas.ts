import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback, useRef, useEffect } from "react";

interface CachedImage {
    img: HTMLImageElement;
    width: number;
    height: number;
}

interface UseClassBoardMapOptions {
    classBoard?: ClassBoard.ClassBoard;
    currentSquare: any;
    hoveredSquareId: number | null;
    squareImages: Map<number, CachedImage>;
    zoom: number;
    panX: number;
    panY: number;
}

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

    // Draw connecting lines between squares
    const drawLines = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!classBoard) return;

        ctx.strokeStyle = 'rgba(100, 150, 255, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([10, 5]); // Dashed connecting lines

        classBoard.lines.forEach((line: any) => {
            const prevSquare = classBoard.squares.find((s: any) => s.id === line.prevSquareId);
            const nextSquare = classBoard.squares.find((s: any) => s.id === line.nextSquareId);

            if (prevSquare && nextSquare) {
                const x1 = (prevSquare.posX / 2) * zoom + canvas.width / 2 + panX;
                const y1 = (-prevSquare.posY / 2) * zoom + canvas.height / 2 + panY;
                const x2 = (nextSquare.posX / 2) * zoom + canvas.width / 2 + panX;
                const y2 = (-nextSquare.posY / 2) * zoom + canvas.height / 2 + panY;

                // Line shadow
                ctx.shadowColor = 'rgba(100, 150, 255, 0.3)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                // Reset shadow
                ctx.shadowColor = 'transparent';
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

            // Shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 10 * zoom;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3 * zoom;

            // Square background
            if (isSelected) {
                ctx.fillStyle = 'rgba(255, 215, 100, 0.5)';
                ctx.fillRect(x - size / 2 - 8, y - size / 2 - 8, size + 16, size + 16);
            } else if (isHovered) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.fillRect(x - size / 2 - 5, y - size / 2 - 5, size + 10, size + 10);
            }

            // Draw square image
            const cachedImage = squareImages.get(square.id);
            if (cachedImage) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                ctx.shadowBlur = 6 * zoom;
                ctx.drawImage(cachedImage.img, x - size / 2, y - size / 2, size, size);
            } else {
                // Placeholder while loading
                ctx.fillStyle = 'rgba(100, 100, 100, 0.7)';
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }

            // Reset shadow
            ctx.shadowColor = 'transparent';

            // Square border
            ctx.strokeStyle = isSelected 
                ? '#FFD764' 
                : (isHovered ? '#ffffff' : 'rgba(170, 170, 170, 0.7)');
            ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);

            // Position label below icon
            ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
            ctx.font = `${11 * zoom}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(`(${square.posX}, ${square.posY})`, x, y + size / 2 + 6 * zoom);

            // Lock indicator
            if (square.lock) {
                ctx.fillStyle = 'rgba(255, 100, 100, 0.95)';
                ctx.beginPath();
                ctx.arc(x + size / 3, y - size / 3, 7 * zoom, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ff6464';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Lock icon
                ctx.fillStyle = '#ffffff';
                ctx.font = `bold ${10 * zoom}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🔒', x + size / 3, y - size / 3);
            }
        });
    }, [classBoard, squareImages, currentSquare, hoveredSquareId, zoom, panX, panY]);

    // Render canvas
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
        renderCanvas();
    }, [renderCanvas]);

    return { canvasRef };
};
