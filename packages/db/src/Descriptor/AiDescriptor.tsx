import {Region, Ai} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import {Renderable, mergeElements} from "../Helper/OutputHelper";
import './Descriptor.css';

interface IProps {
    region: Region;
    aiType: Ai.AiType;
    id: number;
}

class AiDescriptor extends React.Component<IProps> {
    static renderAsString(aiType: Ai.AiType, id: number): string {
        return `[${aiType} - ${id}]`;
    }

    static renderParentAiLinks(region: Region, aiLinks?: Record<Ai.AiType, number[]>): Renderable {
        if (aiLinks) {
            let links: Renderable[] = [];
            for (let [aiType, ids] of Object.entries(aiLinks) as [Ai.AiType, number[]][]) {
                for (let id of ids) {
                    links.push(<AiDescriptor region={region} aiType={aiType} id={id}/>)
                }
            }
            return mergeElements(links, " ");
        }
        return '';
    }

    render() {
        return (
            <Link to={`/${this.props.region}/ai/${this.props.aiType}/${this.props.id}`}>
                {AiDescriptor.renderAsString(this.props.aiType, this.props.id)}
            </Link>
        );
    }
}

export default AiDescriptor;
