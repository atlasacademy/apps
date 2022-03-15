import load_icon_A01 from "../Assets/load_icon_A01.png";
import load_icon_A02 from "../Assets/load_icon_A02.png";
import load_icon_A03 from "../Assets/load_icon_A03.png";
import load_icon_A04 from "../Assets/load_icon_A04.png";

import "./Loading.css";

function Loading() {
    return (
        <div id={"loading"}>
            <img alt={"Loading ..."} className={"fou f1"} src={load_icon_A01} />
            <img alt={"Loading ..."} className={"fou f2"} src={load_icon_A02} />
            <img alt={"Loading ..."} className={"fou f3"} src={load_icon_A03} />
            <img alt={"Loading ..."} className={"fou f4"} src={load_icon_A04} />
        </div>
    );
}

export default Loading;
