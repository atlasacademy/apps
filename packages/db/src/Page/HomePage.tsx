import React from "react";

import { Region } from "@atlasacademy/api-connector";
import { UILanguage } from "@atlasacademy/api-descriptor";

import Manager from "../Setting/Manager";
import { home } from "./Home";
import { WeblateStat } from "./Home/weblate";

interface IProps {
    region?: Region;
}

interface IState {
    translationStats: Map<UILanguage, WeblateStat>;
}

class HomePage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = { translationStats: new Map() };
    }

    componentDidMount() {
        if (this.props.region) {
            Manager.setRegion(this.props.region);
        }

        document.title = "Atlas Academy DB";

        fetch("https://weblate.atlasacademy.io/api/components/atlas-academy/atlas-academy-db/statistics/")
            .then((r) => r.json())
            .then((data) => {
                this.setState({
                    translationStats: new Map(
                        data.results.map((lang: WeblateStat) => [
                            lang.code
                                .replace("_", "-")
                                .replace("zh-Hant", "zh-TW")
                                .replace("zh-Hans", "zh-CN") as UILanguage,
                            lang,
                        ])
                    ),
                });
            });
    }

    render() {
        return home(Manager.uiLanguage())(this.props.region, this.state.translationStats);
    }
}

export default HomePage;
