import { useContext, useState } from "react";

import { ClassBoardContext } from "../Contexts/ClassBoard";
import { useResponsiveCanvas } from "./useResponsiveCanvas";
import { useClassBoardImages } from "./useClassBoardImages";
import { useClassBoardMapCanvas } from "./useClassBoardMapCanvas";
import { useClassBoardMapInteraction } from "./useClassBoardMapInteraction";

interface UseClassBoardMapOptions {
    baseWidth?: number;
    baseHeight?: number;
}

interface UseClassBoardMapReturn {
    // Refs
    containerRef: React.RefObject<HTMLDivElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    
    // State
    canvasSize: { width: number; height: number };
    hoveredSquareId: number | null;
    zoom: number;
    panX: number;
    panY: number;
    isDragging: boolean;
    
    // Event handlers
    handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
    handleMouseLeave: () => void;
    handleCenter: () => void;
    handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchEnd: () => void;
    
    // Data
    classBoard: any;
    squareImages: Map<number, any>;
    isLoading: boolean;
    isGrandClassBoard: boolean;
}

/**
 * Main hook for ClassBoard map functionality
 * Combines all canvas, interaction, image loading, and responsive logic
 */
export const useClassBoardMap = (options: UseClassBoardMapOptions = {}): UseClassBoardMapReturn => {
    const { baseWidth = 1100, baseHeight = 700 } = options;
    
    // Get context data
    const { classBoardData, squareData } = useContext(ClassBoardContext);
    const { loading: isLoading, classBoard } = classBoardData;
    const { changeSquare, currentSquare } = squareData;
    
    // Grand classboard IDs
    const isGrandClassBoard = (classBoard?.id ?? 0) >= 10000;
    
    // Interaction state
    const [hoveredSquareId, setHoveredSquareId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [touchDistance, setTouchDistance] = useState(0);

    // Use responsive canvas hook
    const { containerRef, canvasSize } = useResponsiveCanvas({
        baseWidth,
        baseHeight
    });

    // Load images
    const { squareImages } = useClassBoardImages({
        classBoard
    });

    // Use canvas hook
    const { canvasRef } = useClassBoardMapCanvas({
        classBoard,
        currentSquare,
        hoveredSquareId,
        squareImages,
        zoom,
        panX,
        panY,
        setHoveredSquareId,
        changeSquare
    });

    // Use interaction hook
    const {
        handleCanvasClick,
        handleCanvasMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleWheel,
        handleMouseLeave,
        handleCenter
    } = useClassBoardMapInteraction({
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
        setZoom
    });

    /**
     * Handle touch start - single finger drag or two finger pinch zoom
     */
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1) {
            // Single finger - drag
            setIsDragging(true);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            // Two fingers - pinch zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            setTouchDistance(Math.sqrt(dx * dx + dy * dy));
        }
    };

    /**
     * Handle touch move - single finger drag or two finger pinch zoom
     */
    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length === 1 && isDragging) {
            // Single finger drag
            const deltaX = e.touches[0].clientX - dragStart.x;
            const deltaY = e.touches[0].clientY - dragStart.y;

            setPanX((prev) => prev + deltaX);
            setPanY((prev) => prev + deltaY);
            setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            // Two finger pinch
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const newDistance = Math.sqrt(dx * dx + dy * dy);

            if (touchDistance > 0) {
                const zoomFactor = newDistance / touchDistance;
                const newZoom = Math.max(0.5, Math.min(3, zoom * zoomFactor));

                if (newZoom !== zoom) {
                    setZoom(newZoom);
                }
            }

            setTouchDistance(newDistance);
        }
    };

    /**
     * Handle touch end
     */
    const handleTouchEnd = () => {
        setIsDragging(false);
        setTouchDistance(0);
    };

    return {
        containerRef,
        canvasRef,
        canvasSize,
        hoveredSquareId,
        zoom,
        panX,
        panY,
        isDragging,
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
        classBoard,
        squareImages,
        isLoading,
        isGrandClassBoard
    };
};
