import { useContext } from "react";

import Loading from "../../Component/Loading";
import { ClassBoardContext } from "../../Contexts/ClassBoard";

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
]

interface ClassBoardIconProps {
    x: string;
    y: string;
    image: string;
    clickCallback: () => void;
}

const ClassBoardIcon: React.FC<ClassBoardIconProps> = ({ x, y, image, clickCallback }) => (
    <button onClick={clickCallback} style={{ left: x, top: y }} className="square_btn">
        <img className="square" height={30} src={image} alt={"square"} />
    </button>
);

const ClassBoardMap: React.FC = () => {
    const { classBoardData, squareData } = useContext(ClassBoardContext);
    const { loading, classBoard } = classBoardData;
    const { changeSquare } = squareData;
    const isGrandClassBoard = grandClassBoard.includes(classBoard?.id ?? 0);


    if (loading) {
        return <Loading />;
    }

    return (
        <section data-type={isGrandClassBoard ? "grand" : "normal"} className="breakdown_wrapper">
            <div className="breakdown_container">
                {classBoard?.squares.map((square) => {
                    // Need to center icons with lines
                    const xOffset = 7;

                    if (square.lock) {
                        return (
                            <ClassBoardIcon
                                clickCallback={() => changeSquare(square)}
                                key={square.id}
                                x={`${square.posX / 2 - xOffset}px`}
                                y={`${-square.posY / 2}px`}
                                image={square.lock.items[0].item.icon}
                            />
                        );
                    }

                    if (!square.icon) return null;

                    return (
                        <ClassBoardIcon
                            key={square.id}
                            clickCallback={() => changeSquare(square)}
                            x={`${square.posX / 2 - xOffset}px`}
                            y={`${-square.posY / 2}px`}
                            image={square.icon}
                        />
                    );
                })}
                {!isGrandClassBoard && (<img className="earth" src={classBoard?.icon} alt={classBoard?.name} />)}
                {isGrandClassBoard && (<img className="grand-base" src={"https://static.atlasacademy.io/file/aa-fgo-extract-jp/ClassBoard/Bg/GrandClassScore_base.png"} alt={classBoard?.name} />)}
                {isGrandClassBoard && (<img className="grand-base add" src={"https://static.atlasacademy.io/file/aa-fgo-extract-jp/ClassBoard/Bg/GrandClassScore_add_parts_01.png"} alt={classBoard?.name} />)}
                {isGrandClassBoard && (<img className="grand-base add2" src={"https://static.atlasacademy.io/file/aa-fgo-extract-jp/ClassBoard/Bg/GrandClassScore_add.png"} alt={classBoard?.name} />)}
            
            </div>
            <svg
                className="map_lines"
                viewBox="-565 -365 1100 700"
                width={"1100px"}
                height={"700px"}
                style={{ position: "absolute" }}
            >
                {classBoard?.lines.map((line, key) => {
                    const prevSquare = classBoard.squares.find((s) => s.id === line.prevSquareId);
                    const nextSquare = classBoard.squares.find((s) => s.id === line.nextSquareId);

                    if (prevSquare && nextSquare) {
                        return (
                            <line
                                key={key}
                                x1={prevSquare.posX / 2}
                                y1={-prevSquare.posY / 2}
                                x2={nextSquare.posX / 2}
                                y2={-nextSquare.posY / 2}
                                strokeWidth="1.5"
                                stroke="white"
                            />
                        );
                    }

                    return null;
                })}
            </svg>
        </section>
    );
};

export default ClassBoardMap;
