import React from "react";
import { Link } from "react-router-dom";

import { NoblePhantasm, Region } from "@atlasacademy/api-connector";

import getRubyText from "../Helper/StringHelper";
import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";

interface IProps {
    region: Region;
    noblePhantasm: NoblePhantasm.NoblePhantasmBasic;
    overwriteName?: string;
    overwriteRuby?: string;
}

class NoblePhantasmDescriptor extends React.Component<IProps> {
    render() {
        let name = this.props.overwriteName ?? this.props.noblePhantasm.name;
        let ruby = this.props.overwriteRuby ?? this.props.noblePhantasm.ruby;
        if (this.props.noblePhantasm.id === 100) {
            name = "Extra Attack";
            ruby = "Extra Attack";
        }
        return (
            <Link
                to={`/${this.props.region}/noble-phantasm/${this.props.noblePhantasm.id}`}
                lang={lang(this.props.region)}
            >
                [{getRubyText(this.props.region, name, ruby)}]
            </Link>
        );
    }
}

export default NoblePhantasmDescriptor;

export const NoblePhantasmDescriptorId = ({ region, noblePhantasmId }: { region: Region; noblePhantasmId: number }) => {
    const { data: noblePhantasm } = useApi("noblePhantasmBasic", noblePhantasmId);
    const npLink = `/${region}/noble-phantasm/${noblePhantasmId}`;

    if (noblePhantasm === undefined) {
        return <Link to={npLink}>[NP: {noblePhantasmId}]</Link>;
    }

    return <Link to={npLink}>[{getRubyText(region, noblePhantasm.name, noblePhantasm.ruby)}]</Link>;
};
