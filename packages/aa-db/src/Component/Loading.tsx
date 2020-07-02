import React from "react";

import "./Loading.css";

function Loading() {
    return (
        <div id={'loading'}>
            <img alt={''} className={'fou f1'} src={'./assets/load_icon_A01.png'} />
            <img alt={''} className={'fou f2'} src={'./assets/load_icon_A02.png'} />
            <img alt={''} className={'fou f3'} src={'./assets/load_icon_A03.png'} />
            <img alt={''} className={'fou f4'} src={'./assets/load_icon_A04.png'} />
        </div>
    );
}

export default Loading;
