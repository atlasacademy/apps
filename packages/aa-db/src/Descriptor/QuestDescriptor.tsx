import {Region} from "@atlasacademy/api-connector";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";

interface IProps {
    text: string;
    region: Region;
    questId: number;
    questPhase: number;
}

class QuestDescriptor extends React.Component<IProps> {
    render() {
        if (this.props.text) {
            return (
                <Link to={`/${this.props.region}/quest/${this.props.questId}/${this.props.questPhase}`}>
                    {this.props.text} <FontAwesomeIcon icon={faShare}/>
                </Link>
            );
        } else {
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
                    type = 'Main';
                    break;
            }
    
            return (
                <Link to={`/${this.props.region}/quest/${this.props.questId}/${this.props.questPhase}`}>
                    {type} Quest <FontAwesomeIcon icon={faShare}/>
                </Link>
            );
        }
    }
}

export default QuestDescriptor;
