import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import { lang } from "../Setting/Manager";

const VoiceActorDescriptor = (props: { region: Region; cv?: string }) => {
    const query = props.cv === undefined ? "" : `?cv=${encodeURIComponent(props.cv)}`;
    return (
        <>
            Voice Actor:&nbsp;
            <Link to={`/${props.region}/entities${query}`} lang={lang(props.region)}>
                {props.cv}
            </Link>
        </>
    );
};

export default VoiceActorDescriptor;
