import { Pagination } from "react-bootstrap";

import { Quest, Region } from "@atlasacademy/api-connector";

const PhaseNavigator = (props: {
    region: Region;
    quest: Quest.QuestPhase;
    currentPhase: number;
    setPhase: (phase: number) => void;
}) => {
    const currentPhase = props.currentPhase,
        phases = props.quest.phases.sort((a, b) => a - b);
    return (
        <Pagination style={{ marginBottom: 0, float: "right" }}>
            <Pagination.Prev
                disabled={currentPhase === Math.min(...phases)}
                onClick={() => {
                    props.setPhase(currentPhase - 1);
                }}
            />
            {props.quest.phases.map((phase) => (
                <Pagination.Item
                    key={phase}
                    active={phase === currentPhase}
                    onClick={() => {
                        props.setPhase(phase);
                    }}
                >
                    {phase}
                </Pagination.Item>
            ))}
            <Pagination.Next
                disabled={currentPhase === Math.max(...phases)}
                onClick={() => {
                    props.setPhase(currentPhase + 1);
                }}
            />
        </Pagination>
    );
};
export default PhaseNavigator;
