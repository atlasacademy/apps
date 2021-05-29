import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

const ScriptDescriptor = (props: {
    region: Region;
    scriptId: string;
    scriptName?: string;
    scriptType?: string;
}) => {
    let scriptType = "";
    switch (
        props.scriptId.slice(props.scriptId.length - 1, props.scriptId.length)
    ) {
        case "1":
            scriptType = "Post-battle script";
            break;
        case "0":
            scriptType = "Pre-battle script";
            break;
        default:
            scriptType = "Script";
    }
    return (
        <>
            {props.scriptType ?? scriptType}:&nbsp;
            <Link to={`/${props.region}/script/${props.scriptId}`}>
                {props.scriptName ?? props.scriptId}
            </Link>
        </>
    );
};

export default ScriptDescriptor;
