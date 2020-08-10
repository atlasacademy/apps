import {Region, Trait} from "@atlasacademy/api-connector";
import React from "react";
import TraitDescriptor from "../../Descriptor/TraitDescriptor";
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
                    this.props.traits.map(trait => <TraitDescriptor region={this.props.region} trait={trait}/>),
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
