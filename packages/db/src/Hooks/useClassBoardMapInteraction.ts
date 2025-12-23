import { ClassBoard } from "@atlasacademy/api-connector";
import { useCallback, useRef } from "react";

// Canvas interaction constants
const SQUARE_BASE_SIZE = 35;
const POSITION_DIVISOR = 2;
const Y_AXIS_FLIP = -1;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;
const ZOOM_OUT_FACTOR = 0.9;
const ZOOM_IN_FACTOR = 1.1;
const CURSOR_POINTER = 'pointer';
const CURSOR_GRAB = 'grab';
const TOUCH_TAP_DISTANCE = 15;
const TOUCH_TAP_DURATION = 300;
const TOUCH_TAP_PADDING = 10;

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
    setHoveredSquareId: React.Dispatch<React.SetStateAction<number | null>>;
    changeSquare: (square: ClassBoard.ClassBoardSquare) => void;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    setDragStart: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
    setPanX: React.Dispatch<React.SetStateAction<number>>;
    setPanY: React.Dispatch<React.SetStateAction<number>>;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
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
        setHoveredSquareId,
        changeSquare,
        setIsDragging,
        setDragStart,
        setPanX,
        setPanY,
        setZoom,
    } = options;

    const touchStartPosRef = useRef<{ x: number; y: number; time: number; panX: number; panY: number; zoom: number } | null>(null);

    /**
     * Detect which square is at the given canvas coordinates
     * Returns the square if found, null otherwise
     */
    const getSquareAtCoordinates = useCallback((clickX: number, clickY: number, touchPadding = 0) => {
        if (!classBoard) return null;

        for (const square of classBoard.squares) {
            const x = square.posX / POSITION_DIVISOR;
            const y = Y_AXIS_FLIP * (square.posY / POSITION_DIVISOR);
            const size = SQUARE_BASE_SIZE / zoom;
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
            canvas.style.cursor = CURSOR_POINTER;
        } else {
            setHoveredSquareId(null);
            canvas.style.cursor = CURSOR_GRAB;
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
     * Handle mouse leave event
     * Clears hover state and stops dragging
     */
    const handleMouseLeave = useCallback(() => {
        setHoveredSquareId(null);
        setIsDragging(false);
    }, [setHoveredSquareId, setIsDragging]);

    /**
     * Zoom helpers (button-driven)
     * Centered on canvas midpoint to mimic map controls
     */
    const applyZoomFactor = useCallback((zoomFactor: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const centerX = rect.width / 2 * scaleX;
        const centerY = rect.height / 2 * scaleY;

        const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom * zoomFactor));

        if (newZoom !== zoom) {
            const deltaZoom = newZoom / zoom;
            setPanX(prev => centerX - (centerX - prev) * deltaZoom);
            setPanY(prev => centerY - (centerY - prev) * deltaZoom);
            setZoom(newZoom);
        }
    }, [canvasRef, zoom, setPanX, setPanY, setZoom]);

    const handleZoomIn = useCallback(() => applyZoomFactor(ZOOM_IN_FACTOR), [applyZoomFactor]);
    const handleZoomOut = useCallback(() => applyZoomFactor(ZOOM_OUT_FACTOR), [applyZoomFactor]);

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
        if (e.touches.length !== 1) return;
        const pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        touchStartPosRef.current = { ...pos, time: Date.now(), panX, panY, zoom };
        setIsDragging(true);
        setDragStart(pos);
    }, [panX, panY, zoom, setIsDragging, setDragStart]);

    /**
     * Handle touch move - drag or pinch zoom (throttled with RAF)
     */
    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();

        const touch0 = e.touches[0];
        const deltaX = touch0.clientX - dragStart.x;
        const deltaY = touch0.clientY - dragStart.y;
        setPanX((prev) => prev + deltaX);
        setPanY((prev) => prev + deltaY);
        setDragStart({ x: touch0.clientX, y: touch0.clientY });
    }, [isDragging, dragStart, setPanX, setPanY, setDragStart]);

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

            if (distance < TOUCH_TAP_DISTANCE && duration < TOUCH_TAP_DURATION) {
                const coords = getLogicalCoordinates(touchEnd.x, touchEnd.y);
                if (coords) {
                    const { logicalX, logicalY } = coords;
                    const square = getSquareAtCoordinates(logicalX, logicalY, TOUCH_TAP_PADDING);
                    if (square) {
                        changeSquare(square);
                    }
                }
            }
        }

        setIsDragging(false);
        touchStartPosRef.current = null;
    }, [canvasRef, classBoard, getLogicalCoordinates, getSquareAtCoordinates, changeSquare, setIsDragging]);

    return {
        handleCanvasClick,
        handleCanvasMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave,
        handleCenter,
        handleZoomIn,
        handleZoomOut,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
