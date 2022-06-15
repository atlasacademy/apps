import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Event, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import { lang } from "../Setting/Manager";

export default function EventDescriptor(props: { region: Region; eventId: number }) {
    const [event, setEvent] = useState<Event.EventBasic>(null as any);
    useEffect(() => {
        Api.eventBasic(props.eventId).then((s) => setEvent(s));
    }, [props.eventId]);
    return (
        <Link to={`/${props.region}/event/${props.eventId}`}>
            {event ? <span lang={lang(props.region)}>{event.name}</span> : `Event ${props.eventId}`}
        </Link>
    );
}
