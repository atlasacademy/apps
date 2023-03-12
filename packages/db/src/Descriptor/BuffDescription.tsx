import React from "react";
import { Link } from "react-router-dom";

import { Buff, Region } from "@atlasacademy/api-connector";
import { BuffDescriptor } from "@atlasacademy/api-descriptor";

import BuffIcon from "../Component/BuffIcon";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";
import Description from "./Description";

interface IProps {
    region: Region;
    buff: Buff.BasicBuff;
    passiveFrame?: boolean;
    hideState?: boolean;
}

class BuffDescription extends React.Component<IProps> {
    render() {
        const buff = this.props.buff,
            descriptor = BuffDescriptor.describe(this.props.buff),
            descString = Description.renderAsString(descriptor);

        return (
            <Link
                to={`/${this.props.region}/buff/${buff.id}`}
                lang={lang(this.props.region)}
                title={buff.vals.length > 0 ? `Trait: ${buff.vals.map((trait) => trait.id).join(", ")}` : undefined}
            >
                [
                {buff.icon && !buff.icon?.includes("bufficon_0") ? (
                    <>
                        <BuffIcon
                            location={buff.icon}
                            alt={`${descString} buff icon`}
                            passiveFrame={this.props.passiveFrame}
                            hideState={this.props.hideState}
                        />{" "}
                    </>
                ) : null}
                {descString}]
            </Link>
        );
    }
}

export default BuffDescription;

export function BuffIdDescriptor(props: { region: Region; buffId: number }) {
    const { data: buff } = useApi("buffBasic", props.buffId);
    if (buff !== undefined) {
        return <BuffDescription region={props.region} buff={buff} />;
    } else {
        return null;
    }
}
