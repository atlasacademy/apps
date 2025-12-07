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
            <div className="classboard_nav_container">
                <ul className="classboard_navigation">
                    {classBoards.map((classboard) => {
                        return (
                            <li key={classboard.id}>
                                <Button 
                                    onClick={() => handleNavigation(classboard.id)}
                                    title={classboard.name}
                                >
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
            </div>
            <h1 className="classboard_title">{classBoard?.name}</h1>
            <hr />
            <div className="classboard_controls_container">
                <ul className="classboard_navigation">
                    <li>
                        <Button 
                            variant={show ? "success" : "info"} 
                            onClick={handleClickState}
                            className="show_skills_btn"
                        >
                            {t("Show All Skills")}
                        </Button>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default ClassBoardNavigation;
