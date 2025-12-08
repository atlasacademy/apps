import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback, useRef } from "react";

/**
 * Options for useClassBoardMapInteraction hook
 * Includes refs, state values, and state setters
 */
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

    const rafRef = useRef<number>();
    const touchStartPosRef = useRef<{ x: number; y: number; time: number; panX: number; panY: number; zoom: number } | null>(null);

    /**
     * Detect which square is at the given canvas coordinates
     * Returns the square if found, null otherwise
     */
    const getSquareAtCoordinates = useCallback((clickX: number, clickY: number, touchPadding = 0) => {
        if (!classBoard) return null;

        for (const square of classBoard.squares) {
            const x = square.posX / 2;
            const y = -square.posY / 2;
            const size = 35 / zoom;
            const pad = touchPadding / zoom;

            if (clickX >= x - size / 2 - pad && clickX <= x + size / 2 + pad &&
                clickY >= y - size / 2 - pad && clickY <= y + size / 2 + pad) {
                return square;
            }
        }

        return null;
    }, [classBoard, zoom]);

    /**
     * Convert client (screen) coordinates into logical canvas coordinates
     * Applies canvas CSS scaling, current pan, and zoom.
     */
    const getLogicalCoordinates = useCallback((clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const canvasX = (clientX - rect.left) * scaleX;
        const canvasY = (clientY - rect.top) * scaleY;

        const logicalX = (canvasX - canvas.width / 2 - panX) / zoom;
        const logicalY = (canvasY - canvas.height / 2 - panY) / zoom;

        return { logicalX, logicalY, rect };
    }, [canvasRef, panX, panY, zoom]);

    /**
     * Handle canvas click events
     * Detects which square was clicked and calls changeSquare
     */
    const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!classBoard || isDragging) return;

        const coords = getLogicalCoordinates(e.clientX, e.clientY);
        if (!coords) return;

        const { logicalX: clickX, logicalY: clickY } = coords;

        const square = getSquareAtCoordinates(clickX, clickY);
        if (square) {
            changeSquare(square);
        }
    }, [classBoard, isDragging, getLogicalCoordinates, getSquareAtCoordinates, changeSquare]);

    /**
     * Handle canvas mouse move events
     * Updates hover state and cursor based on which square is under the mouse
     */
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !classBoard) return;

        if (isDragging) return;

        const coords = getLogicalCoordinates(e.clientX, e.clientY);
        if (!coords) return;
        const { logicalX: moveX, logicalY: moveY } = coords;

        const square = getSquareAtCoordinates(moveX, moveY);
        
        if (square) {
            setHoveredSquareId(square.id);
            canvas.style.cursor = 'pointer';
        } else {
            setHoveredSquareId(null);
            canvas.style.cursor = 'grab';
        }
    }, [canvasRef, classBoard, isDragging, getLogicalCoordinates, getSquareAtCoordinates, setHoveredSquareId]);

    /**
     * Handle mouse down event
     * Starts dragging operation
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
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

        setPanX(prev => prev + deltaX);
        setPanY(prev => prev + deltaY);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragStart, setPanX, setPanY, setDragStart]);

    /**
     * Handle mouse wheel events
     * Updates zoom level while keeping the zoom centered under the cursor
     */
    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));

        if (newZoom !== zoom) {
            // Adjust pan to keep zoom centered under cursor
            const deltaZoom = newZoom / zoom;
            setPanX(prev => mouseX - (mouseX - prev) * deltaZoom);
            setPanY(prev => mouseY - (mouseY - prev) * deltaZoom);
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
            const pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            touchStartPosRef.current = { ...pos, time: Date.now(), panX, panY, zoom };
            setIsDragging(true);
            setDragStart(pos);
        } else if (e.touches.length === 2) {
            touchStartPosRef.current = null;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setTouchDistance(Math.sqrt(dx * dx + dy * dy));
        }
    }, [panX, panY, zoom, setIsDragging, setDragStart, setTouchDistance]);

    /**
     * Handle touch move - drag or pinch zoom (throttled with RAF)
     */
    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        
        if (rafRef.current) {
            return;
        }

        // Capture touch data before RAF (TouchEvent gets reused)
        const touchCount = e.touches.length;
        const touch0 = touchCount > 0 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
        const touch1 = touchCount > 1 ? { x: e.touches[1].clientX, y: e.touches[1].clientY } : null;

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = undefined;

            if (touchCount === 1 && touch0 && isDragging) {
                const deltaX = touch0.x - dragStart.x;
                const deltaY = touch0.y - dragStart.y;
                setPanX((prev) => prev + deltaX);
                setPanY((prev) => prev + deltaY);
                setDragStart(touch0);
            } else if (touchCount === 2 && touch0 && touch1 && touchDistance > 0) {
                const dx = touch0.x - touch1.x;
                const dy = touch0.y - touch1.y;
                const newDistance = Math.sqrt(dx * dx + dy * dy);
                const zoomFactor = newDistance / touchDistance;
                const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));
                if (newZoom !== zoom) {
                    setZoom(newZoom);
                }
                setTouchDistance(newDistance);
            }
        });
    }, [isDragging, dragStart, touchDistance, zoom, setPanX, setPanY, setDragStart, setZoom, setTouchDistance]);

    /**
     * Handle touch end
     */
    const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas && classBoard && touchStartPosRef.current && e.changedTouches.length > 0) {
            const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const dx = touchEnd.x - touchStartPosRef.current.x;
            const dy = touchEnd.y - touchStartPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = Date.now() - touchStartPosRef.current.time;

            if (distance < 15 && duration < 300) {
                const coords = getLogicalCoordinates(touchEnd.x, touchEnd.y);
                if (coords) {
                    const { logicalX, logicalY } = coords;
                    const square = getSquareAtCoordinates(logicalX, logicalY, 10);
                    if (square) {
                        changeSquare(square);
                    }
                }
            }
        }

        setIsDragging(false);
        setTouchDistance(0);
        touchStartPosRef.current = null;
    }, [canvasRef, classBoard, getLogicalCoordinates, getSquareAtCoordinates, changeSquare, setIsDragging, setTouchDistance]);

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
