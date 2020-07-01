import React from "react";
import Trait from "../../Api/Data/Trait";
import TraitDescription from "../../Component/TraitDescription";
import {joinElements} from "../../Helper/OutputHelper";

interface IProps {
    traits: Trait[];
}

class ServantTraits extends React.Component<IProps> {
    render() {
        return (
            <div>
                {joinElements(
                    this.props.traits.map(trait => <TraitDescription trait={trait}/>),
                    ', '
                ).map(
                    (element, index) => <span key={index}>{element}</span>
                )}
            </div>
        );
    }
}

export default ServantTraits;
