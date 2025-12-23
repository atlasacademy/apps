import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback, useRef, useEffect } from "react";

// Canvas rendering constants
const POSITION_DIVISOR = 2;
const Y_AXIS_FLIP = -1;
const SQUARE_BASE_SIZE = 35;
const SQUARE_SELECTED_PADDING = 8;
const SQUARE_HOVERED_PADDING = 5;
const LINE_COLOR = 'rgba(100, 150, 255, 0.6)';
const LINE_WIDTH = 2;
const LINE_DASH = [8, 4];
const SQUARE_SELECTED_COLOR = 'rgba(255, 215, 100, 0.5)';
const SQUARE_HOVERED_COLOR = 'rgba(100, 150, 255, 0.3)';
const SQUARE_PLACEHOLDER_COLOR = 'rgba(100, 100, 100, 0.7)';
const SQUARE_SELECTED_BORDER = '#FFD764';
const SQUARE_HOVERED_BORDER = '#6496ff';
const SQUARE_DEFAULT_BORDER = 'rgba(170, 170, 170, 0.7)';
const SQUARE_SELECTED_BORDER_WIDTH = 3;
const SQUARE_HOVERED_BORDER_WIDTH = 2;
const SQUARE_DEFAULT_BORDER_WIDTH = 1;
const LOCK_INDICATOR_COLOR = '#ff6464';
const LOCK_INDICATOR_RADIUS = 6;
const CANVAS_BACKGROUND = '#ffffff';

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

        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash(LINE_DASH);

        classBoard.lines.forEach((line: ClassBoard.ClassBoardLine) => {
            const prevSquare = squareMap.current.get(line.prevSquareId);
            const nextSquare = squareMap.current.get(line.nextSquareId);

            if (prevSquare && nextSquare) {
                const x1 = (prevSquare.posX / POSITION_DIVISOR) * zoom + canvas.width / 2 + panX;
                const y1 = (Y_AXIS_FLIP * (prevSquare.posY / POSITION_DIVISOR)) * zoom + canvas.height / 2 + panY;
                const x2 = (nextSquare.posX / POSITION_DIVISOR) * zoom + canvas.width / 2 + panX;
                const y2 = (Y_AXIS_FLIP * (nextSquare.posY / POSITION_DIVISOR)) * zoom + canvas.height / 2 + panY;

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

        const size = SQUARE_BASE_SIZE * zoom;

        classBoard.squares.forEach((square: ClassBoard.ClassBoardSquare) => {
            const x = (square.posX / POSITION_DIVISOR) * zoom + canvas.width / 2 + panX;
            const y = (Y_AXIS_FLIP * (square.posY / POSITION_DIVISOR)) * zoom + canvas.height / 2 + panY;

            const isSelected = currentSquare?.id === square.id;
            const isHovered = hoveredSquareId === square.id;

            // Square background highlight (only if selected/hovered)
            if (isSelected) {
                ctx.fillStyle = SQUARE_SELECTED_COLOR;
                ctx.fillRect(x - size / 2 - SQUARE_SELECTED_PADDING, y - size / 2 - SQUARE_SELECTED_PADDING, size + SQUARE_SELECTED_PADDING * 2, size + SQUARE_SELECTED_PADDING * 2);
            } else if (isHovered) {
                ctx.fillStyle = SQUARE_HOVERED_COLOR;
                ctx.fillRect(x - size / 2 - SQUARE_HOVERED_PADDING, y - size / 2 - SQUARE_HOVERED_PADDING, size + SQUARE_HOVERED_PADDING * 2, size + SQUARE_HOVERED_PADDING * 2);
            }

            // Draw square image (no shadow for performance)
            const cachedImage = squareImages.get(square.id);
            if (cachedImage) {
                ctx.drawImage(cachedImage.img, x - size / 2, y - size / 2, size, size);
            } else {
                ctx.fillStyle = SQUARE_PLACEHOLDER_COLOR;
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }

            // Square border
            ctx.strokeStyle = isSelected 
                ? SQUARE_SELECTED_BORDER
                : (isHovered ? SQUARE_HOVERED_BORDER : SQUARE_DEFAULT_BORDER);
            ctx.lineWidth = isSelected ? SQUARE_SELECTED_BORDER_WIDTH : (isHovered ? SQUARE_HOVERED_BORDER_WIDTH : SQUARE_DEFAULT_BORDER_WIDTH);
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);

            // Lock indicator (simple red dot)
            if (square.lock) {
                ctx.fillStyle = LOCK_INDICATOR_COLOR;
                ctx.beginPath();
                ctx.arc(x + size / 3, y - size / 3, LOCK_INDICATOR_RADIUS * zoom, 0, Math.PI * 2);
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
        ctx.fillStyle = CANVAS_BACKGROUND;
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
