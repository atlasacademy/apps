import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

const IllustratorDescriptor = (props: { region: Region; illustrator?: string }) => {
    return (
        <>
            Illustrator:&nbsp;
            <Link to={`/${props.region}/entities?illustrator=${props.illustrator}`}>
                {props.illustrator}
            </Link>
        </>
    );
};

export default IllustratorDescriptor;
