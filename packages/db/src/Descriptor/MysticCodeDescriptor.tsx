import {MysticCode, Region} from "@atlasacademy/api-connector";
import React from "react";
import {Link} from "react-router-dom";
import FaceIcon from "../Component/FaceIcon";

interface IPropsCommon {
    region: Region;
    mysticCode: Omit<MysticCode.MysticCodeBasic, 'item'>;
}

function CommonMysticCodeDescriptor (props : IPropsCommon & { item: {male: string; female: string} }) {
    return (
        <Link to={`/${props.region}/mystic-code/${props.mysticCode.id}`}>
            <FaceIcon location={props.item.male}/>
            <FaceIcon location={props.item.female}/>
            {' '}
            [{props.mysticCode.name}]
        </Link>
    );
}

interface IProps extends IPropsCommon{
    mysticCode: MysticCode.MysticCode;
}

class MysticCodeDescriptor extends React.Component<IProps> {
    render() {
        const item = this.props.mysticCode.extraAssets.item;
        return <CommonMysticCodeDescriptor {...this.props} item={item} />
    }
}

interface IPropsBasic extends IPropsCommon {
    mysticCode: MysticCode.MysticCodeBasic;
}

function BasicMysticCodeDescriptor (props : IPropsBasic) {
    return <CommonMysticCodeDescriptor {...props} item={props.mysticCode.item} />
}

export { BasicMysticCodeDescriptor };
export default MysticCodeDescriptor;
