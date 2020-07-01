import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Region from "../../Api/Data/Region";
import Skill from "../../Api/Data/Skill";
import {describeFunc} from "../../Helper/FuncHelper";
import {handleNewLine} from "../../Helper/OutputHelper";
import {describeQuestType} from "../../Helper/QuestHelper";

interface IProps {
    region: Region;
    skill: Skill;
}

class CraftEssenceSkill extends React.Component<IProps, any> {
    render() {
        const skill = this.props.skill;
        return (
            <div>
                <h3>
                    {skill.name}
                    &nbsp;
                    <Link to={`/${this.props.region}/skill/${skill.id}`}>
                        <FontAwesomeIcon icon={faShare}/>
                    </Link>
                </h3>

                {skill.condQuestId && skill.condQuestPhase ? (
                    <Alert variant={'primary'}>
                        <Link to={`/${this.props.region}/quest/${skill.condQuestId}/${skill.condQuestPhase}`}>
                            Available after {describeQuestType(skill.condQuestId, skill.condQuestPhase)}
                            &nbsp;
                            <FontAwesomeIcon icon={faShare}/>
                        </Link>
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
                        let funcDescription = describeFunc(this.props.region, func);

                        return (
                            <tr key={index}>
                                <td>
                                    {funcDescription}
                                    &nbsp;
                                    <Link to={`/${this.props.region}/func/${func.funcId}`}>
                                        <FontAwesomeIcon icon={faShare}/>
                                    </Link>
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

export default CraftEssenceSkill;
