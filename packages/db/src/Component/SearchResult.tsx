import Fuse from "fuse.js";
import React from "react";
import { Redirect } from "react-router-dom";

import { Region, Servant } from "@atlasacademy/api-connector";

import Api from "../Api";
import { removeDiacriticalMarks } from "../Helper/StringHelper";
import ErrorStatus from "./ErrorStatus";
import Loading from "./Loading";

interface IProps {
    region: Region;
    search: string;
    tab?: string;
}

interface IState {
    loading: boolean;
    fuse: Fuse<Servant.ServantBasic>;
    servants: Servant.ServantBasic[];
}

class SearchResults extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            servants: [],
            loading: true,
            fuse: new Fuse([]),
        };
    }

    componentDidMount() {
        Api.servantList().then((servants) => {
            const fuseServants = new Fuse(
                servants.map((servant) => {
                    return {
                        ...servant,
                        name: removeDiacriticalMarks(servant.name),
                    };
                }),
                {
                    ignoreLocation: true,
                    keys: ["name"],
                    threshold: 0.2,
                }
            );
            this.setState({ servants, fuse: fuseServants, loading: false });
        });
    }

    render() {
        const matchedFuzzyServants = this.state.fuse
            .search(removeDiacriticalMarks(this.props.search))
            .map((doc) => doc.item);

        const matchedFuzzyServant = matchedFuzzyServants[0] ?? { id: 0 };

        if (this.state.loading) {
            return <Loading />;
        }
        if (matchedFuzzyServant.id > 0) {
            return (
                <Redirect
                    to={`/${this.props.region}/servant/${matchedFuzzyServant.collectionNo}${
                        this.props.tab ? "/" + this.props.tab : ""
                    }`}
                />
            );
        } else {
            return <ErrorStatus endpoint="servant" region={this.props.region} />;
        }
    }
}

export default SearchResults;
