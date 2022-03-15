import React from "react";
import { Link } from "react-router-dom";

import { Region, Ai } from "@atlasacademy/api-connector";

import { Renderable, mergeElements } from "../Helper/OutputHelper";

import "./Descriptor.css";

interface IProps {
    region: Region;
    aiType: Ai.AiType;
    id: number;
    skill1?: number;
    skill2?: number;
    skill3?: number;
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
                    links.push(<AiDescriptor region={region} aiType={aiType} id={id} />);
                }
            }
            return mergeElements(links, " ");
        }
        return "";
    }

    render() {
        let baseUrl = `/${this.props.region}/ai/${this.props.aiType}/${this.props.id}`;

        const searchParams = new URLSearchParams();

        if (this.props.skill1 !== undefined && this.props.skill1 !== 0)
            searchParams.append("skillId1", this.props.skill1.toString());
        if (this.props.skill2 !== undefined && this.props.skill2 !== 0)
            searchParams.append("skillId2", this.props.skill2.toString());
        if (this.props.skill3 !== undefined && this.props.skill3 !== 0)
            searchParams.append("skillId3", this.props.skill3.toString());

        if (Array.from(searchParams.entries()).length > 0) {
            baseUrl += `?${searchParams.toString()}`;
        }

        return <Link to={baseUrl}>{AiDescriptor.renderAsString(this.props.aiType, this.props.id)}</Link>;
    }
}

export default AiDescriptor;
