import { Col, Row } from "react-bootstrap";

import { Event, Region } from "@atlasacademy/api-connector";

import { lang } from "../../Setting/Manager";

const EventHeelPortrait = ({ region, heelPortraits }: { region: Region; heelPortraits: Event.EventHeelPortrait[] }) => {
    return (
        <>
            <Row className="mt-3">
                {heelPortraits.map((heel) => (
                    <Col key={heel.id} className="text-center mb-4" xs={6} sm={4} md={4} lg={3}>
                        <img src={heel.image} alt={`${heel.name} Heel Portrait`} style={{ width: "100%" }} />{" "}
                        <div lang={lang(region)}>{heel.name}</div>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default EventHeelPortrait;
