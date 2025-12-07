import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback } from "react";

interface UseClassBoardMapInteractionOptions {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    zoom: number;
    panX: number;
    panY: number;
    classBoard?: ClassBoard.ClassBoard;
    isDragging: boolean;
    dragStart: { x: number; y: number };
    touchDistance: number;
    setHoveredSquareId: React.Dispatch<React.SetStateAction<number | null>>;
    changeSquare: (square: ClassBoard.ClassBoardSquare) => void;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    setDragStart: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    setPanX: React.Dispatch<React.SetStateAction<number>>;
    setPanY: React.Dispatch<React.SetStateAction<number>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setTouchDistance: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for ClassBoard map interaction handling
 * Manages clicks, hover, drag, zoom, and touch events
 */
export const useClassBoardMapInteraction = (options: UseClassBoardMapInteractionOptions) => {
    const {
        canvasRef,
        zoom,
        panX,
        panY,
        classBoard,
        isDragging,
        dragStart,
        touchDistance,
        setHoveredSquareId,
        changeSquare,
        setIsDragging,
        setDragStart,
        setPanX,
        setPanY,
        setZoom,
        setTouchDistance,
    } = options;

    /**
     * Detect which square is at the given canvas coordinates
     * Returns the square if found, null otherwise
     */
    const getSquareAtCoordinates = useCallback((clickX: number, clickY: number) => {
        if (!classBoard) return null;

        for (const square of classBoard.squares) {
            const x = square.posX / 2;
            const y = -square.posY / 2;
            const size = 35 / zoom;

            if (clickX >= x - size / 2 && clickX <= x + size / 2 &&
                clickY >= y - size / 2 && clickY <= y + size / 2) {
                return square;
            }
        }

        return null;
    }, [classBoard, zoom]);

    /**
     * Handle canvas click events
     * Detects which square was clicked and calls changeSquare
     */
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard || isDragging) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left - canvas.width / 2 - panX) / zoom;
        const clickY = (e.clientY - rect.top - canvas.height / 2 - panY) / zoom;

        const square = getSquareAtCoordinates(clickX, clickY);
        if (square) {
            changeSquare(square);
        }
    }, [canvasRef, classBoard, isDragging, panX, panY, zoom, getSquareAtCoordinates, changeSquare]);

    /**
     * Handle canvas mouse move events
     * Updates hover state and cursor based on which square is under the mouse
     */
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard) return;

        if (isDragging) return;

        const rect = canvas.getBoundingClientRect();
        const moveX = (e.clientX - rect.left - canvas.width / 2 - panX) / zoom;
        const moveY = (e.clientY - rect.top - canvas.height / 2 - panY) / zoom;

        const square = getSquareAtCoordinates(moveX, moveY);
        
        if (square) {
            setHoveredSquareId(square.id);
            canvas.style.cursor = 'pointer';
        } else {
            setHoveredSquareId(null);
            canvas.style.cursor = 'grab';
        }
    }, [canvasRef, classBoard, isDragging, panX, panY, zoom, getSquareAtCoordinates, setHoveredSquareId]);

    /**
     * Handle mouse down event
     * Starts dragging operation
     */
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, [setIsDragging, setDragStart]);

    /**
     * Handle mouse up event
     * Ends dragging operation
     */
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, [setIsDragging]);

    /**
     * Handle mouse move during dragging
     * Updates pan offset based on mouse delta
     */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setPanX((prev: any) => prev + deltaX);
        setPanY((prev: any) => prev + deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragStart, setPanX, setPanY, setDragStart]);

    /**
     * Handle mouse wheel events
     * Updates zoom level while keeping the zoom centered under the cursor
     */
    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));

        if (newZoom !== zoom) {
            // Adjust pan to keep zoom centered under cursor
            const deltaZoom = newZoom / zoom;
            setPanX((prev: any) => mouseX - (mouseX - prev) * deltaZoom);
            setPanY((prev: any) => mouseY - (mouseY - prev) * deltaZoom);
            setZoom(newZoom);
        }
    }, [canvasRef, zoom, setPanX, setPanY, setZoom]);

    /**
     * Handle mouse leave event
     * Clears hover state and stops dragging
     */
    const handleMouseLeave = useCallback(() => {
        setHoveredSquareId(null);
        setIsDragging(false);
    }, [setHoveredSquareId, setIsDragging]);

    /**
     * Reset zoom and pan to center
     */
    const handleCenter = useCallback(() => {
        setZoom(1);
        setPanX(0);
        setPanY(0);
    }, [setZoom, setPanX, setPanY]);

    /**
     * Handle touch start - drag or pinch zoom
     */
    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setTouchDistance(Math.sqrt(dx * dx + dy * dy));
        }
    }, [setIsDragging, setDragStart, setTouchDistance]);

    /**
     * Handle touch move - drag or pinch zoom
     */
    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1 && isDragging) {
            const deltaX = e.touches[0].clientX - dragStart.x;
            const deltaY = e.touches[0].clientY - dragStart.y;
            setPanX((prev) => prev + deltaX);
            setPanY((prev) => prev + deltaY);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2 && touchDistance > 0) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);
            const zoomFactor = newDistance / touchDistance;
            const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));
            if (newZoom !== zoom) {
                setZoom(newZoom);
            }
            setTouchDistance(newDistance);
        }
    }, [isDragging, dragStart, touchDistance, zoom, setPanX, setPanY, setDragStart, setZoom, setTouchDistance]);

    /**
     * Handle touch end
     */
    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        setTouchDistance(0);
    }, [setIsDragging, setTouchDistance]);

    return {
        handleCanvasClick,
        handleCanvasMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleWheel,
        handleMouseLeave,
        handleCenter,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
