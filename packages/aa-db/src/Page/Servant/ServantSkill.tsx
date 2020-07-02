import React from "react";
import {Alert, Table} from "react-bootstrap";
import Region from "../../Api/Data/Region";
import Skill from "../../Api/Data/Skill";
import FuncDescriptor from "../../Descriptor/FuncDescriptor";
import QuestDescriptor from "../../Descriptor/QuestDescriptor";
import SkillDescriptor from "../../Descriptor/SkillDescriptor";
import {describeMutators} from "../../Helper/FuncHelper";
import {handleNewLine} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    skill: Skill;
}

class ServantSkill extends React.Component<IProps, any> {
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
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                        <th>10</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Cooldown</td>
                        {skill.coolDown.map((cooldown, index) => {
                            return <td key={index}>{cooldown}</td>;
                        })}
                    </tr>
                    {skill.functions.map((func, index) => {
                        let mutatingDescriptions = describeMutators(this.props.region, func);

                        for (let i = 0; i < 10; i++) {
                            if (!mutatingDescriptions[i])
                                mutatingDescriptions.push('-');
                        }

                        return (
                            <tr key={index}>
                                <td>
                                    <FuncDescriptor region={this.props.region} func={func}/>
                                </td>
                                {mutatingDescriptions.map((description, index) => {
                                    return (
                                        <td key={index}>{description}</td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default ServantSkill;
