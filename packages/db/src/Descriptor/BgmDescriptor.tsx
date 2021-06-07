import { Region, Bgm } from "@atlasacademy/api-connector";
import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Button } from "react-bootstrap";
import VoiceLinePlayer from "./VoiceLinePlayer";
import { Link } from "react-router-dom";
import { faShare } from "@fortawesome/free-solid-svg-icons";

export const getBgmFileName = (audioUrl?: string) => {
    const urlParts = (audioUrl ?? "").split("/");
    return urlParts[urlParts.length - 1].replace(".mp3", "");
};

export const getBgmName = (bgm: Bgm.Bgm) => {
    if (bgm.name !== "" && bgm.name !== "0") {
        return bgm.name;
    } else {
        return getBgmFileName(bgm.audioAsset);
    }
};

export default function BgmDescriptor(props: {
    region: Region;
    bgm: Bgm.Bgm;
    showName?: string;
    showLink?: boolean;
}) {
    const bgm = props.bgm;
    if (bgm.id === 0) {
        return null;
    } else if (bgm.audioAsset !== undefined) {
        const showName = getBgmName(bgm);
        const toLink = props.showLink ? (
            <>
                <Button
                    variant="primary"
                    as={Link}
                    to={`/${props.region}/bgm/${bgm.id}`}
                >
                    <FontAwesomeIcon
                        icon={faShare}
                        title={`Go to ${props.region} BGM ${showName}`}
                    />
                </Button>
            </>
        ) : null;
        return (
            <>
                <ButtonGroup size="sm">
                    <VoiceLinePlayer
                        audioAssetUrls={[bgm.audioAsset]}
                        delay={[0]}
                        title={bgm.name}
                    />
                    <Button
                        variant={"info"}
                        href={bgm.audioAsset}
                        target="_blank"
                        title={`Download ${showName}`}
                    >
                        {props.showName ?? showName}&nbsp;
                        <FontAwesomeIcon icon={faFileAudio} />
                    </Button>
                    {toLink}
                </ButtonGroup>
            </>
        );
    } else {
        return (
            <Button variant={"info"} disabled>
                {bgm.name}
            </Button>
        );
    }
}
