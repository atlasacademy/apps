import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

import { Buff, Region } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

import Api from "../Api";
import BuffIcon from "../Component/BuffIcon";
import Description from "./Description";

interface IProps {
    region: Region;
    buff: Buff.BasicBuff;
    passiveFrame?: boolean;
}

class BuffDescription extends React.Component<IProps> {
    static renderAsString(buff: Buff.BasicBuff): string {
        const descriptor = BuffDescriptor.describe(buff);

        return "[" + Description.renderAsString(descriptor) + "]";
    }

    render() {
        const buff = this.props.buff,
            descriptor = BuffDescriptor.describe(this.props.buff);

        return (
            <Link to={`/${this.props.region}/buff/${buff.id}`}>
                [{buff.icon ? <BuffIcon location={buff.icon} passiveFrame={this.props.passiveFrame} /> : undefined}
                {buff.icon ? " " : undefined}
                {Description.renderAsString(descriptor)}]
            </Link>
        );
    }
}

export default BuffDescription;

export function BuffIdDescriptor(props: { region: Region; buffId: number }) {
    const [buff, setBuff] = useState<Buff.BasicBuff>(null as any);
    useEffect(() => {
        Api.buffBasic(props.buffId).then((s) => setBuff(s));
    }, [props.region, props.buffId]);
    if (buff) {
        return <BuffDescription region={props.region} buff={buff} />;
    } else {
        return null;
    }
}
