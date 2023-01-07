import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { MysticCode, Region } from "@atlasacademy/api-connector";

import Api from "../Api";
import FaceIcon from "../Component/FaceIcon";
import { lang } from "../Setting/Manager";

interface IPropsCommon {
    region: Region;
    mysticCode: Omit<MysticCode.MysticCodeBasic, "item">;
}

function CommonMysticCodeDescriptor(props: IPropsCommon & { item: { male: string; female: string } }) {
    return (
        <Link to={`/${props.region}/mystic-code/${props.mysticCode.id}`}>
            <FaceIcon location={props.item.male} />
            <FaceIcon location={props.item.female} /> [<span lang={lang(props.region)}>{props.mysticCode.name}</span>]
        </Link>
    );
}

interface IProps extends IPropsCommon {
    mysticCode: MysticCode.MysticCode;
}

class MysticCodeDescriptor extends React.Component<IProps> {
    render() {
        const item = this.props.mysticCode.extraAssets.item;
        return <CommonMysticCodeDescriptor {...this.props} item={item} />;
    }
}

interface IPropsBasic extends IPropsCommon {
    mysticCode: MysticCode.MysticCodeBasic;
}

function BasicMysticCodeDescriptor(props: IPropsBasic) {
    return <CommonMysticCodeDescriptor {...props} item={props.mysticCode.item} />;
}

export { BasicMysticCodeDescriptor };
export default MysticCodeDescriptor;

export function MysticCodeDescriptorId(props: { region: Region; mcId: number }) {
    const [mc, setMC] = useState<MysticCode.MysticCodeBasic>(null as any);
    useEffect(() => {
        Api.mysticCodeBasic(props.mcId).then((s) => setMC(s));
    }, [props.region, props.mcId]);
    if (mc !== null) {
        return <BasicMysticCodeDescriptor region={props.region} mysticCode={mc} />;
    } else {
        return null;
    }
}
