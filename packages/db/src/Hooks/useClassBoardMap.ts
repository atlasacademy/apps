import { useContext, useState } from "react";
import { ClassBoard } from "@atlasacademy/api-connector";

import { ClassBoardContext } from "../Contexts/ClassBoard";
import { useResponsiveCanvas } from "./useResponsiveCanvas";
import { useClassBoardImages } from "./useClassBoardImages";
import { useClassBoardMapCanvas } from "./useClassBoardMapCanvas";
import { useClassBoardMapInteraction } from "./useClassBoardMapInteraction";

// Constants
const DEFAULT_CANVAS_WIDTH = 1100;
const DEFAULT_CANVAS_HEIGHT = 700;
const GRAND_CLASS_BOARD_THRESHOLD = 10000;

interface UseClassBoardMapOptions {
    baseWidth?: number;
    baseHeight?: number;
}

interface UseClassBoardMapReturn {
    containerRef: React.RefObject<HTMLDivElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasSize: { width: number; height: number };
    zoom: number;
    isLoading: boolean;
    isGrandClassBoard: boolean;
    classBoard?: ClassBoard.ClassBoard;
    handleCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseUp: () => void;
    handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    handleMouseLeave: () => void;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleCenter: () => void;
    handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
    handleTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

/**
 * Main hook for ClassBoard map functionality
 * Orchestrates canvas, interaction, images, and responsive sizing
 */
export const useClassBoardMap = (options: UseClassBoardMapOptions = {}): UseClassBoardMapReturn => {
    const { baseWidth = DEFAULT_CANVAS_WIDTH, baseHeight = DEFAULT_CANVAS_HEIGHT } = options;
    
    const { classBoardData, squareData } = useContext(ClassBoardContext);
    const { loading: isLoading, classBoard } = classBoardData;
    const { changeSquare, currentSquare } = squareData;
    
    const isGrandClassBoard = (classBoard?.id ?? 0) >= GRAND_CLASS_BOARD_THRESHOLD;
    
    const [hoveredSquareId, setHoveredSquareId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const { containerRef, canvasSize } = useResponsiveCanvas({ baseWidth, baseHeight });
    const { squareImages } = useClassBoardImages({ classBoard });
    const { canvasRef } = useClassBoardMapCanvas({
        classBoard,
        currentSquare,
        hoveredSquareId,
        squareImages,
        zoom,
        panX,
        panY,
    });

    const {
        handleCanvasClick,
        handleCanvasMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave,
        handleZoomIn,
        handleZoomOut,
        handleCenter,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
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
        setZoom,
    });

    return {
        containerRef,
        canvasRef,
        canvasSize,
        zoom,
        isLoading,
        isGrandClassBoard,
        classBoard,
        handleCanvasClick,
        handleCanvasMouseMove,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        handleMouseLeave,
        handleZoomIn,
        handleZoomOut,
        handleCenter,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
