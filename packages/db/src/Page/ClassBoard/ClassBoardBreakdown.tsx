import { useContext } from "react";
import { Table } from "react-bootstrap";

import EffectBreakdown from "../../Breakdown/EffectBreakdown";
import SkillBreakdown from "../../Breakdown/SkillBreakdown";
import { ClassBoardContext } from "../../Contexts/ClassBoard";
import ItemDescriptor from "../../Descriptor/ItemDescriptor";
import Manager from "../../Setting/Manager";

import "./ClassBoardBreakdown.css";
import ClassBoardMission from "./ClassBoardMission";
import { ClassBoard } from "@atlasacademy/api-connector";

interface PropsBreakdownTable {
    currentSquare?: ClassBoard.ClassBoardSquare
}

const BreakdownTable: React.FC<PropsBreakdownTable> = ({ currentSquare }) => {
    if (!currentSquare) {
        return null;
    }
    
    return (
            <Table striped borderless style={{ marginTop: "1rem" }} responsive>
            <tbody>
                <tr>
                    <td width="5%" rowSpan={2}>
                        {currentSquare.icon && (
                            <img src={currentSquare.icon} alt={currentSquare.id + "-square"} height={50} />
                        )}
                        {currentSquare.lock && (
                            <img
                                src={currentSquare.lock.items[0].item.icon}
                                alt={currentSquare.lock.id + "-square"}
                                height={50}
                            />
                        )}
                    </td>
                    <td>
                        {currentSquare.targetSkill && (
                            <SkillBreakdown
                                cooldowns={false}
                                region={Manager.region()}
                                skill={currentSquare.targetSkill}
                                levels={7}
                            />
                        )}
                        {currentSquare.targetCommandSpell && (
                            <EffectBreakdown
                                funcs={currentSquare.targetCommandSpell.functions}
                                region={Manager.region()}
                                levels={5}
                            />
                        )}
                        {currentSquare.lock && 
                            <ClassBoardMission items={currentSquare.lock.items} condTargetId={currentSquare.lock.condTargetId}/>
                        }
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul className="items_requeriments">
                            <h4>Requirements</h4>
                            <hr />
                            {currentSquare.items.length > 0 &&
                                currentSquare.items.map((item, i) => {
                                    return (
                                        <li key={item.item.id}>
                                            <ItemDescriptor
                                                item={item.item}
                                                region={Manager.region()}
                                                quantity={item.amount}
                                                height={70}
                                                quantityHeight={12}
                                            />
                                        </li>
                                    );
                                })}
                            {currentSquare.lock &&
                                currentSquare.lock.items.length > 0 &&
                                currentSquare.lock.items.map((item) => {
                                    return (
                                        <li key={item.item.id}>
                                            <ItemDescriptor
                                                item={item.item}
                                                region={Manager.region()}
                                                quantity={item.amount}
                                                height={70}
                                                quantityHeight={12}
                                            />
                                        </li>
                                    );
                                })}
                        </ul>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

const ClassBoardBreakdown: React.FC = () => {
    const { squareData, states } = useContext(ClassBoardContext);
    const { currentSquare, squares } = squareData
    const { showAllSkills } = states

    if (showAllSkills.show) {
        return squares.map((currentSquare) => {
            return <BreakdownTable key={currentSquare.id} currentSquare={currentSquare} />
        })
    }

    return <BreakdownTable currentSquare={currentSquare} />
};

export default ClassBoardBreakdown;
