import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Event, Region } from "@atlasacademy/api-connector";

import Api from "../Api";

export default function EventDescriptor(props: { region: Region; eventId: number }) {
    const [event, setEvent] = useState<Event.EventBasic>(null as any);
    useEffect(() => {
        Api.eventBasic(props.eventId).then((s) => setEvent(s));
    }, [props.eventId]);
    return <Link to={`/${props.region}/event/${props.eventId}`}>{event ? event.name : `Event ${props.eventId}`}</Link>;
}
