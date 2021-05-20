import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

const VoiceActorDescriptor = (props: { region: Region; cv?: string }) => {
    return (
        <>
            Voice Actor:&nbsp;
            <Link to={`/${props.region}/entities?cv=${props.cv}`}>
                {props.cv}
            </Link>
        </>
    );
};

export default VoiceActorDescriptor;
