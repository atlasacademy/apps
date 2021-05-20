import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

const VoiceActorDescriptor = (props: { region: Region; cv?: string }) => {
    const query =
        props.cv === undefined ? "" : `?cv=${encodeURIComponent(props.cv)}`;
    return (
        <>
            Voice Actor:&nbsp;
            <Link to={`/${props.region}/entities${query}`}>{props.cv}</Link>
        </>
    );
};

export default VoiceActorDescriptor;
