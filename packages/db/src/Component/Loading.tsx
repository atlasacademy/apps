import kon_load_00 from "../Assets/kon_loading/00.png";
import kon_load_01 from "../Assets/kon_loading/01.png";
import kon_load_03 from "../Assets/kon_loading/03.png";
import kon_load_05 from "../Assets/kon_loading/05.png";
import kon_load_06 from "../Assets/kon_loading/06.png";
import load_icon_A01 from "../Assets/load_icon_A01.png";
import load_icon_A02 from "../Assets/load_icon_A02.png";
import load_icon_A03 from "../Assets/load_icon_A03.png";
import load_icon_A04 from "../Assets/load_icon_A04.png";

import "./Loading.css";

const KonLoading = () => {
    return (
        <div id="loading">
            <img alt="Loading ..." className="kon f1" src={kon_load_00} />
            <img alt="Loading ..." className="kon f2" src={kon_load_01} />
            <img alt="Loading ..." className="kon f5" src={kon_load_03} />
            <img alt="Loading ..." className="kon f4" src={kon_load_05} />
            <img alt="Loading ..." className="kon f3" src={kon_load_06} />
        </div>
    );
};

const FouLoading = () => {
    return (
        <div id="loading">
            <img alt="Loading ..." className="fou f1" src={load_icon_A01} />
            <img alt="Loading ..." className="fou f2" src={load_icon_A02} />
            <img alt="Loading ..." className="fou f3" src={load_icon_A03} />
            <img alt="Loading ..." className="fou f4" src={load_icon_A04} />
        </div>
    );
};

const Loading = Math.random() > 0.5 ? () => <KonLoading /> : () => <FouLoading />;

export default Loading;
