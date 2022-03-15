import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region, Bgm } from "@atlasacademy/api-connector";

import VoiceLinePlayer from "./VoiceLinePlayer";

export const getBgmName = (bgm: Bgm.Bgm) => {
    if (bgm.name !== "" && bgm.name !== "0") {
        return bgm.name;
    } else {
        return bgm.fileName;
    }
};

export default function BgmDescriptor(props: {
    region: Region;
    bgm: Bgm.Bgm;
    showName?: string;
    showLink?: boolean;
    style?: React.CSSProperties;
}) {
    const bgm = props.bgm;
    if (bgm.id === 0) {
        return null;
    } else if (bgm.audioAsset !== undefined) {
        const showName = getBgmName(bgm);
        const toLink = props.showLink ? (
            <>
                <Button variant="primary" as={Link} to={`/${props.region}/bgm/${bgm.id}`}>
                    <FontAwesomeIcon icon={faShare} title={`Go to ${props.region} BGM ${showName}`} />
                </Button>
            </>
        ) : null;
        const downloadButton = bgm.notReleased ? (
            <Button disabled variant="secondary" target="_blank" title={showName}>
                {showName}
            </Button>
        ) : (
            <Button variant={"info"} href={bgm.audioAsset} target="_blank" title={`Download ${showName}`}>
                {props.showName ?? showName}&nbsp;
                <FontAwesomeIcon icon={faFileAudio} />
            </Button>
        );
        return (
            <>
                <ButtonGroup size="sm" style={props.style}>
                    <VoiceLinePlayer audioAssetUrls={[bgm.audioAsset]} delay={[0]} title={bgm.name} />
                    {downloadButton}
                    {toLink}
                </ButtonGroup>
            </>
        );
    } else {
        return (
            <Button variant={"info"} disabled style={props.style}>
                {bgm.name}
            </Button>
        );
    }
}
