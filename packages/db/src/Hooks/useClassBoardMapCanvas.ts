import { useCallback, useRef, useEffect } from "react";

interface CachedImage {
    img: HTMLImageElement;
    width: number;
    height: number;
}

interface UseClassBoardMapOptions {
    classBoard: any;
    currentSquare: any;
    hoveredSquareId: number | null;
    squareImages: Map<number, CachedImage>;
    zoom: number;
    panX: number;
    panY: number;
    setHoveredSquareId: (id: number | null) => void;
    changeSquare: (square: any) => void;
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
        setHoveredSquareId,
        changeSquare
    } = options;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw grid with dashed lines
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const gridSize = 50;
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]); // Dashed lines

        // Draw vertical lines
        const startXGrid = Math.floor((-canvas.width / 2 - panX) / (gridSize * zoom)) * gridSize;
        const endXGrid = Math.ceil((canvas.width / 2 - panX) / (gridSize * zoom)) * gridSize;

        for (let x = startXGrid; x <= endXGrid; x += gridSize) {
            const screenX = x * gridSize * zoom + canvas.width / 2 + panX;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, canvas.height);
            ctx.stroke();
        }

        // Draw horizontal lines
        const startYGrid = Math.floor((-canvas.height / 2 - panY) / (gridSize * zoom)) * gridSize;
        const endYGrid = Math.ceil((canvas.height / 2 - panY) / (gridSize * zoom)) * gridSize;

        for (let y = startYGrid; y <= endYGrid; y += gridSize) {
            const screenY = -y * gridSize * zoom + canvas.height / 2 + panY;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(canvas.width, screenY);
            ctx.stroke();
        }

        ctx.setLineDash([]); // Reset dashed lines
    }, [panX, panY, zoom]);

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

        classBoard.squares.forEach((square: any) => {
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

        // Draw grid
        drawGrid(ctx, canvas);

        // Draw connecting lines
        drawLines(ctx, canvas);

        // Draw squares
        drawSquares(ctx, canvas);
    }, [classBoard, drawGrid, drawLines, drawSquares]);

    useEffect(() => {
        renderCanvas();
    }, [renderCanvas]);

    // Handle canvas click
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left - canvas.width / 2 - panX) / zoom;
        const clickY = (e.clientY - rect.top - canvas.height / 2 - panY) / zoom;

        for (const square of classBoard.squares) {
            const x = square.posX / 2;
            const y = -square.posY / 2;
            const size = 35 / zoom;

            if (clickX >= x - size / 2 && clickX <= x + size / 2 &&
                clickY >= y - size / 2 && clickY <= y + size / 2) {
                changeSquare(square);
                return;
            }
        }
    };

    // Handle canvas mouse move for hover
    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard) return;

        const rect = canvas.getBoundingClientRect();
        const moveX = (e.clientX - rect.left - canvas.width / 2 - panX) / zoom;
        const moveY = (e.clientY - rect.top - canvas.height / 2 - panY) / zoom;

        let found = false;
        for (const square of classBoard.squares) {
            const x = square.posX / 2;
            const y = -square.posY / 2;
            const size = 35 / zoom;

            if (moveX >= x - size / 2 && moveX <= x + size / 2 &&
                moveY >= y - size / 2 && moveY <= y + size / 2) {
                setHoveredSquareId(square.id);
                canvas.style.cursor = 'pointer';
                found = true;
                break;
            }
        }

        if (!found) {
            setHoveredSquareId(null);
            canvas.style.cursor = 'grab';
        }
    };

    return {
        canvasRef,
        handleCanvasClick,
        handleCanvasMouseMove
    };
};
