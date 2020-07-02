import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import Region from "../Api/Data/Region";

interface IProps {
    region: Region;
    questId: number;
    questPhase: number;
}

class QuestDescriptor extends React.Component<IProps>{
    render() {
        const prefix = Math.floor(this.props.questId / 1000000);
        let type = "";

        switch (prefix) {
            case 91:
                type = 'Interlude';
                break;
            case 94:
                type = 'Strengthening';
                break;
            default:
                type = 'Main Quest';
                break;
        }

        return (
            <Link to={`/${this.props.region}/quest/${this.props.questId}/${this.props.questPhase}`}>
                {type} Quest <FontAwesomeIcon icon={faShare} />
            </Link>
        );
    }
}

export default QuestDescriptor;
