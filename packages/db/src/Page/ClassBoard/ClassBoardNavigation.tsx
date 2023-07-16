import { useContext } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import ClassIcon from "../../Component/ClassIcon";
import { ClassBoardContext } from "../../Contexts/ClassBoard";
import { classFilters } from "../ServantsPage";

import "./ClassBoardNavigation.css";

const ClassBoardNavigation: React.FC = () => {
    const { t } = useTranslation();
    const { classBoardData, states } = useContext(ClassBoardContext);
    const { changeBoard, classBoard, classBoards } = classBoardData;
    const {
        showAllSkills: { setShow, show },
    } = states;

    const handleClickState = () => {
        setShow(!show);
    };

    return (
        <>
            <ul className="classboard_navigation">
                {classFilters.map((val, index) => {
                    const id = classBoards.findIndex((classBoard) => {
                        return classBoard.classes.some((classElement) => classElement.className === val);
                    });

                    if (id < 0) {
                        return null;
                    }

                    return (
                        <li key={"nav-" + index}>
                            <Button onClick={() => changeBoard(id)}>
                                <ClassIcon className={val} height={35} />
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
