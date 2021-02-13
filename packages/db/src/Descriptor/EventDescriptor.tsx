import { Event } from "@atlasacademy/api-connector";
import { useEffect, useState } from "react";
import Api from "../Api";

export default function EventDescriptor(props: { eventId: number }) {
    const [event, setEvent] = useState<Event.EventBasic>(null as any);
    useEffect(() => {
        Api.eventBasic(props.eventId).then((s) => setEvent(s));
    }, [props.eventId]);
    return event ? <>{event.name}</> : <>eventId {props.eventId}</>;
}
