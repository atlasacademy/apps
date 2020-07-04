import React from "react";
import {Alert, Table} from "react-bootstrap";
import Region from "../../Api/Data/Region";
import Skill from "../../Api/Data/Skill";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import QuestDescriptor from "../../Descriptor/QuestDescriptor";
import SkillDescriptor from "../../Descriptor/SkillDescriptor";
import {handleNewLine} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    skill: Skill;
}

class ServantPassive extends React.Component<IProps> {
    render() {
        const skill = this.props.skill;
        return (
            <div>
                <h3>
                    <SkillDescriptor region={this.props.region} skill={skill} iconHeight={33}/>
                </h3>

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        Available after <QuestDescriptor region={this.props.region}
                                                         questId={skill.condQuestId}
                                                         questPhase={skill.condQuestPhase}/>
                    </Alert>
                ) : null}

                <p>{handleNewLine(skill.detail)}</p>

                <Table responsive>
                    <thead>
                    <tr>
                        <th>Effect</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skill.functions.map((func, index) => {
                        return (
                            <tr key={index}>
                                <td>
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantPassive;
