import { useContext, useState } from "react";

import Loading from "../../Component/Loading";
import { ClassBoardContext } from "../../Contexts/ClassBoard";
import { useClassBoardMapCanvas } from "../../Hooks/useClassBoardMapCanvas";
import { useClassBoardImages } from "../../Hooks/useClassBoardImages";
import { useClassBoardMapInteraction } from "../../Hooks/useClassBoardMapInteraction";

import "./ClassBoardMap.css";

const grandClassBoard: number[] = [
    10001,
    10002,
    10003,
    10004,
    10005,
    10006,
    10007,
    10008,
    10009
];

const ClassBoardMap: React.FC = () => {
    const { classBoardData, squareData } = useContext(ClassBoardContext);
    const { loading, classBoard } = classBoardData;
    const { changeSquare, currentSquare } = squareData;
    const isGrandClassBoard = grandClassBoard.includes(classBoard?.id ?? 0);

    const [hoveredSquareId, setHoveredSquareId] = useState<number | null>(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

    if (loading) {
        return <Loading />;
    }

    return (
        <section
            data-type={isGrandClassBoard ? "grand" : "normal"}
            className="breakdown_wrapper"
        >
            <canvas
                ref={canvasRef}
                width={1100}
                height={700}
                className="classboard_canvas"
                onClick={handleCanvasClick}
                onMouseMove={(e) => {
                    handleCanvasMouseMove(e);
                    handleMouseMove(e);
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
            />
            <div className="canvas_info">
                <div className="zoom_level">Zoom: {(zoom * 100).toFixed(0)}%</div>
                <div className="canvas_controls">
                    <button onClick={handleCenter} className="btn_reset">↺ Center</button>
                </div>
            </div>
        </section>
    );
};

export default ClassBoardMap;
