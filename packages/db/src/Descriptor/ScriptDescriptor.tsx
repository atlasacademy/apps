import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

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

const ScriptDescriptor = (props: {
    region: Region;
    scriptId: string;
    scriptName?: string;
    scriptType?: string;
}) => {
    let defaultScriptType = "";
    switch (
        props.scriptId.slice(props.scriptId.length - 1, props.scriptId.length)
    ) {
        case "0":
            defaultScriptType = "Pre-battle script";
            break;
        case "1":
            defaultScriptType = "Post-battle script";
            break;
        case "2":
            defaultScriptType = "Pre-battle post-scene script";
            break;
        case "3":
            defaultScriptType = "Post-battle pre-scene script";
            break;
        case "4":
            defaultScriptType =
                "Post-battle script (without defeating the enemies)";
            break;
        default:
            defaultScriptType = "Script";
    }
    return (
        <>
            {props.scriptType ?? defaultScriptType}:&nbsp;
            <Link to={`/${props.region}/script/${props.scriptId}`}>
                {props.scriptName ?? props.scriptId}
            </Link>
        </>
    );
};

export default ScriptDescriptor;
