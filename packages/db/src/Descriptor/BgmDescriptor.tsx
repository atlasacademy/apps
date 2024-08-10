import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Bgm, Region } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";
import VoiceLinePlayer from "./VoiceLinePlayer";

export const getBgmName = (bgm: Bgm.Bgm) => {
    if (bgm.name !== "" && bgm.name !== "0") {
        return bgm.name;
    } else {
        return bgm.fileName;
    }
};

interface BgmProps {
    region: Region;
    showName?: string;
    showLink?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export const BgmDescriptorId = (props: BgmProps & { bgmId: number }) => {
    const { data: bgm } = useApi("bgm", props.bgmId);
    if (bgm === undefined) return <></>;

    return <BgmDescriptor {...props} bgm={bgm} />;
};

export const BgmDescriptorFileName = (props: BgmProps & { bgm: Bgm.Bgm }) => {
    const { data: bgmApi } = useApi("bgm", -1, props.bgm.fileName);

    if (bgmApi === undefined) {
        return <BgmDescriptor {...props} bgm={props.bgm} />;
    } else {
        return <BgmDescriptor {...props} bgm={bgmApi} />;
    }
};

export default function BgmDescriptor(props: BgmProps & { bgm: Bgm.Bgm }) {
    const { bgm, region, className, style } = props;
    if (bgm.id === 0) {
        return null;
    } else if (bgm.audioAsset !== undefined) {
        const showName = getBgmName(bgm);
        const toLink = props.showLink ? (
            <>
                <Button variant="primary" as={Link} to={`/${region}/bgm/${bgm.id}`}>
                    <FontAwesomeIcon icon={faShare} title={`Go to ${region} BGM ${showName}`} />
                </Button>
            </>
        ) : null;
        const downloadButton = bgm.notReleased ? (
            <Button disabled variant="secondary" target="_blank" title={showName}>
                <span lang={lang(region)}>{showName}</span>
            </Button>
        ) : (
            <Button variant={"info"} href={bgm.audioAsset} target="_blank" title={`Download ${showName}`}>
                {props.showName ?? <span lang={lang(region)}>{showName}</span>}&nbsp;
                <FontAwesomeIcon icon={faFileAudio} />
            </Button>
        );
        return (
            <>
                <ButtonGroup size="sm" style={style}>
                    <VoiceLinePlayer audioAssetUrls={[bgm.audioAsset]} delay={[0]} title={bgm.name} />
                    {downloadButton}
                    {toLink}
                </ButtonGroup>
            </>
        );
    } else {
        return (
            <Button variant={"info"} disabled style={style} className={className}>
                <span lang={lang(region)}>{bgm.name}</span>
            </Button>
        );
    }
}
