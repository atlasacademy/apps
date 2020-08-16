import {Region, Trait} from "@atlasacademy/api-connector";
import React from "react";
import TraitDescription from "../../Descriptor/TraitDescription";
import {joinElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    traits: Trait.Trait[];
}

class ServantTraits extends React.Component<IProps> {
    render() {
        return (
            <div>
                {joinElements(
                    this.props.traits.map(trait => <TraitDescription region={this.props.region} trait={trait}/>),
                    ', '
                ).map(
                    (element, index) => <span key={index}>{element}</span>
                )}

                <br/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default ServantTraits;
