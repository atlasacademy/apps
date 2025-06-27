import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { generatePath, useHistory } from "react-router-dom";

import { AssetHost } from "../../Api";
import { ClassBoardContext } from "../../Contexts/ClassBoard";
import Manager from "../../Setting/Manager";

import "./ClassBoardNavigation.css";

const ClassBoardNavigation: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    const { classBoardData, states } = useContext(ClassBoardContext);
    const { changeBoard, classBoard, classBoards } = classBoardData;
    const {
        showAllSkills: { setShow, show },
    } = states;

    const handleNavigation = (id: number) => {
        const path = generatePath("/:region(JP)/classboard/:id([0-9]+)", {
            region: Manager.region(),
            id: id,
        });

        history.push(path);
        changeBoard(id);
    };

    const handleClickState = () => {
        setShow(!show);
    };

    return (
        <>
            <ul className="classboard_navigation">
                {classBoards.map((classboard, index) => {
                    return (
                        <li key={classboard.id}>
                            <Button onClick={() => handleNavigation(classboard.id)}>
                                <img
                                    height={35}
                                    src={`${AssetHost}/JP/ClassIcons/class2_${classboard.id}.png`}
                                    alt={classboard.name}
                                />
                            </Button>
                        </li>
                    );
                })}
            </ul>
            <h1>{classBoard?.name}</h1>
            <hr />
            <ul className="classboard_navigation">
                <li>
                    <Button variant={show ? "success" : "info"} onClick={handleClickState}>
                        {t("Show All Skills")}
                    </Button>
                </li>
            </ul>
        </>
    );
};

export default ClassBoardNavigation;
