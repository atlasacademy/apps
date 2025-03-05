import Fuse from "fuse.js";
import React from "react";
import { Redirect } from "react-router-dom";

import { CraftEssence, Region, Servant, War } from "@atlasacademy/api-connector";

import Api from "../Api";
import { removeDiacriticalMarks } from "../Helper/StringHelper";
import ErrorStatus from "./ErrorStatus";
import Loading from "./Loading";

type entity = Servant.ServantBasic | CraftEssence.CraftEssenceBasic | War.WarBasic;

interface IProps {
    endpoint: string;
    region: Region;
    search: string;
    tab?: string;
}

interface IState {
    loading: boolean;
    fuse: Fuse<any>;
    entities: entity[];
    endpoint: string;
}

const niceEndpoints = {
    "craft-essence": "craftEssence",
    "mystic-code": "mysticCode",
    "command-code": "commandCode",
};

class SearchResults extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            endpoint: "",
            entities: [],
            fuse: new Fuse([]),
            loading: true,
        };
    }

    componentDidMount() {
        const endpoint =
            this.props.endpoint in niceEndpoints
                ? niceEndpoints[this.props.endpoint as keyof typeof niceEndpoints]
                : this.props.endpoint;

        (Api[(endpoint + "List") as keyof Api] as () => Promise<entity[]>)().then((entities) => {
            const fuse = new Fuse(
                entities.map((entity) => {
                    return {
                        ...entity,
                        name: removeDiacriticalMarks("longName" in entity ? entity.longName : entity.name),
                    };
                }),
                {
                    ignoreLocation: true,
                    keys: [
                        "name",
                        "originalName",
                        {
                            name: "overwriteName",
                            getFn: (entity) => ("overwriteName" in entity ? (entity.overwriteName ?? "") : ""),
                        },
                        {
                            name: "originalOverwriteName",
                            getFn: (entity) =>
                                "originalOverwriteName" in entity ? (entity.originalOverwriteName ?? "") : "",
                        },
                    ],
                    threshold: 0.2,
                }
            );
            this.setState({
                endpoint,
                entities,
                fuse,
                loading: false,
            });
        });
    }

    render() {
        const getMatchedFuzzyItem = () =>
            this.state.fuse.search(removeDiacriticalMarks(this.props.search)).map((doc) => doc.item)[0];

        const matchedItem = getMatchedFuzzyItem() ?? { id: 0 };

        if (this.state.loading) {
            return <Loading />;
        }
        if (matchedItem.id > 0) {
            return (
                <Redirect
                    to={`/${this.props.region}/${this.props.endpoint}/${matchedItem.collectionNo ?? matchedItem.id}${
                        this.props.tab ? "/" + this.props.tab : ""
                    }`}
                />
            );
        } else {
            return <ErrorStatus endpoint={this.props.endpoint} region={this.props.region} />;
        }
    }
}

export default SearchResults;
