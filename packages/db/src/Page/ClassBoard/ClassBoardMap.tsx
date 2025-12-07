import React, { useContext, useMemo } from "react";

import Loading from "../../Component/Loading";
import { useClassBoardMap } from "../../Hooks/useClassBoardMap";

import "./ClassBoardMap.css";
import { Region, CondType, Mission } from "@atlasacademy/api-connector";
import { ClassBoardContext } from "../../Contexts/ClassBoard";
import CondTargetNumDescriptor from "../../Descriptor/CondTargetNumDescriptor";

const ClassBoardMap: React.FC<{ region: Region }> = ({ region }) => {
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
        handleTouchEnd,
        classBoard
    } = useClassBoardMap();

    const { missionData } = useContext(ClassBoardContext);
    const { currentMissions } = missionData;

    const missionMap = useMemo<Map<number, Mission.Mission>>(() => {
        return new Map(
            currentMissions.flatMap((missionGroup) => missionGroup.missions.map((mission) => [mission.id, mission]))
        );
    }, [currentMissions]);

    const hasUnlockCondition =
        classBoard !== undefined &&
        classBoard.condType !== CondType.NONE &&
        classBoard.condTargetId !== 0;

    if (isLoading) {
        return <Loading />;
    }



    return (
        <section
            data-type={isGrandClassBoard ? "grand" : "normal"}
            className="breakdown_wrapper"
            ref={containerRef}
        >
            {hasUnlockCondition && classBoard && (
                <div className="classboard_unlock">
                    <h4>Unlock Requirement</h4>
                    <CondTargetNumDescriptor
                        region={region}
                        cond={classBoard.condType}
                        targets={[classBoard.condTargetId]}
                        num={classBoard.condNum}
                        missions={missionMap}
                    />
                </div>
            )}
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
