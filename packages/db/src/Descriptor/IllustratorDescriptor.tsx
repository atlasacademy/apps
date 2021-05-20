import { Region } from "@atlasacademy/api-connector";
import { Link } from "react-router-dom";

const IllustratorDescriptor = (props: {
    region: Region;
    illustrator?: string;
}) => {
    const query =
        props.illustrator === undefined
            ? ""
            : `?illustrator=${encodeURIComponent(props.illustrator)}`;
    return (
        <>
            Illustrator:&nbsp;
            <Link to={`/${props.region}/entities${query}`}>
                {props.illustrator}
            </Link>
        </>
    );
};

export default IllustratorDescriptor;
