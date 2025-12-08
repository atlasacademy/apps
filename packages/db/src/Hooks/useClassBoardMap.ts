import { useContext, useState } from "react";
import { ClassBoard } from "@atlasacademy/api-connector";

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
    handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
    handleMouseLeave: () => void;
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
    const { baseWidth = 1100, baseHeight = 700 } = options;
    
    const { classBoardData, squareData } = useContext(ClassBoardContext);
    const { loading: isLoading, classBoard } = classBoardData;
    const { changeSquare, currentSquare } = squareData;
    
    const isGrandClassBoard = (classBoard?.id ?? 0) >= 10000;
    
    const [hoveredSquareId, setHoveredSquareId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [touchDistance, setTouchDistance] = useState(0);

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
        handleWheel,
        handleMouseLeave,
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
        touchDistance,
        setHoveredSquareId,
        changeSquare,
        setIsDragging,
        setDragStart,
        setPanX,
        setPanY,
        setZoom,
        setTouchDistance,
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
        handleWheel,
        handleMouseLeave,
        handleCenter,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
};
