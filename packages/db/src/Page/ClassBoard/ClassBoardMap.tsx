import React from "react";

import Loading from "../../Component/Loading";
import { useClassBoardMap } from "../../Hooks/useClassBoardMap";

import "./ClassBoardMap.css";

const ClassBoardMap: React.FC = () => {
    // All logic consolidated in single hook
    const {
        containerRef,
        canvasRef,
        canvasSize,
        zoom,
        isLoading,
        isGrandClassBoard,
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
        handleTouchEnd
    } = useClassBoardMap();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <section
            data-type={isGrandClassBoard ? "grand" : "normal"}
            className="breakdown_wrapper"
            ref={containerRef}
        >
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
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
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
