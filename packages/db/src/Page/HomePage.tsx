import React from "react";

import { Region } from "@atlasacademy/api-connector";

import Manager from "../Setting/Manager";
import { home } from "./Home";

interface IProps {
    region?: Region;
}

class HomePage extends React.Component<IProps> {
    componentDidMount() {
        if (this.props.region) {
            Manager.setRegion(this.props.region);
        }

        document.title = "Atlas Academy DB";
    }

    render() {
        return home(Manager.uiLanguage())(this.props.region);
    }
}

export default HomePage;
