import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

const IllustratorDescriptor = (props: { region: Region; illustrator?: string; hideTypeText?: boolean }) => {
    const query = props.illustrator === undefined ? "" : `?illustrator=${encodeURIComponent(props.illustrator)}`;
    return (
        <>
            {props.hideTypeText ? null : <>Illustrator:&nbsp;</>}
            <Link to={`/${props.region}/entities${query}`}>{props.illustrator}</Link>
        </>
    );
};

export default IllustratorDescriptor;
