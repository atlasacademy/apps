import { Col, Row } from "react-bootstrap";

import { Region, Skill } from "@atlasacademy/api-connector";

import SkillBreakdown from "../../Breakdown/SkillBreakdown";
import { flatten } from "../../Helper/PolyFill";

const ExtraPassive = ({ region, skills }: { region: Region; skills: Skill.Skill[] }) => {
    if (skills.length === 0) {
        return null;
    }

    const solomonEORBondNum = [10, 11, 12, 13, 14];

    const passiveNums = new Set(
        flatten(skills.map((skill) => skill.extraPassive.map((extraPassive) => extraPassive.num))).filter(
            (num) => !solomonEORBondNum.includes(num)
        )
    );

    return (
        <>
            {Array.from(passiveNums)
                .sort((a, b) => a - b)
                .concat(solomonEORBondNum)
                .map((passiveNum) => (
                    <div key={passiveNum}>
                        <Row>
                            {skills
                                .filter((skill) => skill.extraPassive.map((ep) => ep.num).includes(passiveNum))
                                .map((skill) => {
                                    return (
                                        <Col xs={12} lg={6} key={skill.id}>
                                            <SkillBreakdown
                                                region={region}
                                                skill={skill}
                                                cooldowns={false}
                                                extraPassiveCond={true}
                                            />
                                        </Col>
                                    );
                                })}
                        </Row>
                    </div>
                ))}
        </>
    );
};

export default ExtraPassive;
