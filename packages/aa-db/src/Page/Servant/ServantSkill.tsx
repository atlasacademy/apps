import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Skill from "../../Api/Data/Skill";
import {describeFunc, describeMutators} from "../../Helper/FuncHelper";
import {handleNewLine} from "../../Helper/OutputHelper";
import {describeQuestType} from "../../Helper/QuestHelper";

interface IProps {
    skill: Skill;
}

class ServantSkill extends React.Component<IProps, any> {
    render() {
        const skill = this.props.skill;
        return (
            <div>
                <h3>
                    {skill.name}
                    &nbsp;
                    <Link to={`/skill/${skill.id}`}>
                        <FontAwesomeIcon icon={faShare}/>
                    </Link>
                </h3>

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        <Link to={`/quest/${skill.condQuestId}/${skill.condQuestPhase}`}>
                            Available after {describeQuestType(skill.condQuestId, skill.condQuestPhase)}
                            &nbsp;
                            <FontAwesomeIcon icon={faShare}/>
                        </Link>
                    </Alert>
                ): null}

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
                        let funcDescription = describeFunc(func),
                            mutatingDescriptions = describeMutators(func);

                        for (let i = 0; i < 10; i++) {
                            if (!mutatingDescriptions[i])
                                mutatingDescriptions.push('-');
                        }

                        return (
                            <tr key={index}>
                                <td>
                                    {funcDescription}
                                    &nbsp;
                                    <Link to={`/func/${func.funcId}`}>
                                        <FontAwesomeIcon icon={faShare}/>
                                    </Link>
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
