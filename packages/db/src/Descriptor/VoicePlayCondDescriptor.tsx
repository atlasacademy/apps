import { useTranslation } from "react-i18next";

import { BattlePoint, Profile, Region, Servant } from "@atlasacademy/api-connector";

import { mergeElements } from "../Helper/OutputHelper";
import CondTargetValueDescriptor from "./CondTargetValueDescriptor";

function VoicePlayGroup(props: {
    region: Region;
    playConds: Profile.VoicePlayCond[];
    servants: Map<number, Servant.ServantBasic>;
    battlePoints?: BattlePoint.BattlePoint[];
}) {
    return (
        <>
            {mergeElements(
                props.playConds.map((playCond) => (
                    <CondTargetValueDescriptor
                        region={props.region}
                        cond={playCond.condType}
                        target={playCond.targetId}
                        value={playCond.condValues[0]}
                        servants={props.servants}
                        forceFalseDescription={"Can't be played in my room"}
                        battlePoints={props.battlePoints}
                    />
                )),
                " and "
            )}
        </>
    );
}

function AllVoicePlayGroups(props: {
    region: Region;
    groups: number[];
    playConds: Profile.VoicePlayCond[];
    servants: Map<number, Servant.ServantBasic>;
    battlePoints?: BattlePoint.BattlePoint[];
}) {
    if (props.groups.length > 1) {
        return (
            <ul className="mb-0">
                {props.groups.map((group) => (
                    <li key={group}>
                        <VoicePlayGroup
                            region={props.region}
                            playConds={props.playConds.filter((playCond) => playCond.condGroup === group)}
                            servants={props.servants}
                            battlePoints={props.battlePoints}
                        />
                    </li>
                ))}
            </ul>
        );
    } else {
        return (
            <>
                {props.groups.map((group) => (
                    <VoicePlayGroup
                        key={group}
                        region={props.region}
                        playConds={props.playConds.filter((playCond) => playCond.condGroup === group)}
                        servants={props.servants}
                        battlePoints={props.battlePoints}
                    />
                ))}
            </>
        );
    }
}

export default function VoicePlayCondDescriptor(props: {
    region: Region;
    playConds: Profile.VoicePlayCond[];
    servants: Map<number, Servant.ServantBasic>;
    battlePoints?: BattlePoint.BattlePoint[];
}) {
    const { t } = useTranslation();
    const groups = Array.from(new Set(props.playConds.map((playCond) => playCond.condGroup)));
    if (props.playConds.length > 0) {
        return (
            <>
                <b>{t(groups.length === 1 ? "Voice Play Requirement_one" : "Voice Play Requirement_other")}:</b>
                <br />
                <AllVoicePlayGroups
                    region={props.region}
                    groups={groups}
                    playConds={props.playConds}
                    servants={props.servants}
                    battlePoints={props.battlePoints}
                />
            </>
        );
    } else {
        return null;
    }
}
