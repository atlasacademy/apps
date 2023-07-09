import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import { CompareRegion, ScriptSource } from "../Component/Script";
import { lang } from "../Setting/Manager";

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

export const getScriptQueryString = (scriptSource?: ScriptSource, compareSource?: CompareRegion) => {
    const scriptQuery = new URLSearchParams();
    if (scriptSource && scriptSource !== "original") scriptQuery.set("scriptSource", scriptSource);
    if (compareSource) scriptQuery.set("compareSource", compareSource);

    return scriptQuery.toString() ? `?${scriptQuery}` : "";
};

const ScriptDescriptor = (props: {
    region: Region;
    scriptId: string;
    scriptName?: string;
    scriptType?: string;
    scriptSource?: ScriptSource;
    compareSource?: CompareRegion;
}) => {
    const defaultScriptType = getScriptType(props.scriptId),
        scriptName =
            props.scriptName === undefined ? props.scriptId : <span lang={lang(props.region)}>{props.scriptName}</span>,
        scriptSourceQuery = getScriptQueryString(props.scriptSource, props.compareSource);
    if (props.scriptType === "") {
        return <Link to={`/${props.region}/script/${props.scriptId}${scriptSourceQuery}`}>{scriptName}</Link>;
    }
    return (
        <>
            {props.scriptType ?? defaultScriptType}:&nbsp;
            <Link to={`/${props.region}/script/${props.scriptId}${scriptSourceQuery}`}>{scriptName}</Link>
        </>
    );
};

export default ScriptDescriptor;
