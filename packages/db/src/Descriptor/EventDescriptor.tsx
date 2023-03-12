import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";

export default function EventDescriptor(props: { region: Region; eventId: number }) {
    const { data: event } = useApi("eventBasic", props.eventId);
    return (
        <Link to={`/${props.region}/event/${props.eventId}`}>
            {event !== undefined ? <span lang={lang(props.region)}>{event.name}</span> : `Event ${props.eventId}`}
        </Link>
    );
}
