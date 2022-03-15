import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

const getOrder = (scriptId: string) => {
    const lastDigit = scriptId.slice(scriptId.length - 1, scriptId.length);
    switch (lastDigit) {
        case "0":
            return 0;
        case "1":
            return 2;
        case "2":
            return 1;
        case "3":
            return 3;
        case "4":
            return 4;
        default:
            return parseInt(lastDigit);
    }
};

export const sortScript = (scriptIds: string[]) => {
    const sortedScriptIds = [...scriptIds];
    sortedScriptIds.sort((a, b) => getOrder(a) - getOrder(b));
    return sortedScriptIds;
};

export const getScriptType = (scriptId: string) => {
    switch (scriptId.slice(scriptId.length - 1, scriptId.length)) {
        case "0":
            return "Pre-battle script";
        case "1":
            return "Post-battle script";
        case "2":
            return "Pre-battle post-scene script";
        case "3":
            return "Post-battle pre-scene script";
        case "4":
            return "Post-battle script (without defeating the enemies)";
        default:
            return "Script";
    }
};

const ScriptDescriptor = (props: { region: Region; scriptId: string; scriptName?: string; scriptType?: string }) => {
    const defaultScriptType = getScriptType(props.scriptId);
    if (props.scriptType === "") {
        return <Link to={`/${props.region}/script/${props.scriptId}`}>{props.scriptName ?? props.scriptId}</Link>;
    }
    return (
        <>
            {props.scriptType ?? defaultScriptType}:&nbsp;
            <Link to={`/${props.region}/script/${props.scriptId}`}>{props.scriptName ?? props.scriptId}</Link>
        </>
    );
};

export default ScriptDescriptor;
