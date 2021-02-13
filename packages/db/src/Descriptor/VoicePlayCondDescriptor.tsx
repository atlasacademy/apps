import { Profile, Region, Servant } from "@atlasacademy/api-connector";
import { mergeElements } from "../Helper/OutputHelper";
import CondDescriptor from "./CondDescriptor";

function VoicePlayGroup(props: {
    region: Region;
    playConds: Profile.VoicePlayCond[];
    servants: Servant.ServantBasic[];
}) {
    return (
        <>
            {mergeElements(
                props.playConds.map((playCond) => (
                    <CondDescriptor
                        region={props.region}
                        cond={playCond.condType}
                        target={playCond.targetId}
                        value={playCond.condValue}
                        servants={props.servants}
                        forceFalseDescription={"Unplayable in my room"}
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
    servants: Servant.ServantBasic[];
}) {
    if (props.groups.length > 1) {
        return (
            <ul style={{ marginBottom: 0 }}>
                {props.groups.map((group) => (
                    <li>
                        <VoicePlayGroup
                            region={props.region}
                            playConds={props.playConds.filter(
                                (playCond) => playCond.condGroup === group
                            )}
                            servants={props.servants}
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
                        region={props.region}
                        playConds={props.playConds.filter(
                            (playCond) => playCond.condGroup === group
                        )}
                        servants={props.servants}
                    />
                ))}
            </>
        );
    }
}

export default function VoicePlayCondDescriptor(props: {
    region: Region;
    playConds: Profile.VoicePlayCond[];
    servants: Servant.ServantBasic[];
}) {
    const groups = Array.from(
        new Set(props.playConds.map((playCond) => playCond.condGroup))
    );
    if (props.playConds.length > 0) {
        return (
            <>
                <b>
                    Play Requirement
                    {groups.length > 1 ? "s (any of the following):" : ":"}
                </b>
                <br />
                <AllVoicePlayGroups
                    region={props.region}
                    groups={groups}
                    playConds={props.playConds}
                    servants={props.servants}
                />
            </>
        );
    } else {
        return null;
    }
}
