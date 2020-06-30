import React from "react";
import Trait from "../../Api/Data/Trait";
import {joinElements} from "../../Helper/ArrayHelper";
import {describeTrait} from "../../Helper/TraitHelper";

interface IProps {
    traits: Trait[];
}

class ServantTraits extends React.Component<IProps> {
    render() {
        return (
            <div>
                {joinElements(
                    this.props.traits.map(trait => describeTrait(trait)),
                    ', '
                ).map(
                    (element, index) => <span key={index}>{element}</span>
                )}
            </div>
        );
    }
}

export default ServantTraits;
