import steggy_load_01 from "../Assets/Steggy_loading/load_icon_A01.png";
import steggy_load_02 from "../Assets/Steggy_loading/load_icon_A02.png";
import steggy_load_03 from "../Assets/Steggy_loading/load_icon_A03.png";
import steggy_load_04 from "../Assets/Steggy_loading/load_icon_A04.png";
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

const SteggyLoading = () => {
    return (
        <div id="loading">
            <img alt="Loading ..." className="fou f1" src={steggy_load_01} />
            <img alt="Loading ..." className="fou f2" src={steggy_load_02} />
            <img alt="Loading ..." className="fou f3" src={steggy_load_03} />
            <img alt="Loading ..." className="fou f4" src={steggy_load_04} />
        </div>
    );
};

const randomNumber = Math.floor(Math.random() * 3);

const Loading = () => {
    switch (randomNumber) {
        case 0:
            return <KonLoading />;
        case 1:
            return <FouLoading />;
        case 2:
            return <SteggyLoading />;
        default:
            return <KonLoading />;
    }
};

export default Loading;
