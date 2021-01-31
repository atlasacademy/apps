import { Event } from "@atlasacademy/api-connector";
import { useState } from "react";
import Api from "../Api";

export default function EventDescriptor(props: { eventId: number }) {
  const [event, setEvent] = useState<Event.EventBasic>(null as any);
  Api.eventBasic(props.eventId).then((s) => setEvent(s));
  return event ? <>{event.name}</> : <>eventId {props.eventId}</>;
}
