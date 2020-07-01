import React from "react";
import Region from "../../Api/Data/Region";
import Trait from "../../Api/Data/Trait";
import TraitDescription from "../../Component/TraitDescription";
import {joinElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    traits: Trait[];
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
            </div>
        );
    }
}

export default ServantTraits;
