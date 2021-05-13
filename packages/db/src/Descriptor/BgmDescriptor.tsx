import { Region, Bgm } from "@atlasacademy/api-connector";
import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonGroup, Button } from "react-bootstrap";
import VoiceLinePlayer from "./VoiceLinePlayer";

export default function BgmDescriptor(props: { region: Region; bgm: Bgm.Bgm }) {
    const bgm = props.bgm;
    if (bgm.id === 0) {
        return null;
    } else if (bgm.audioAsset !== undefined) {
        let showName = "";
        if (bgm.name !== "") {
            showName = bgm.name;
        } else {
            const urlParts = bgm.audioAsset.split("/");
            showName = urlParts[urlParts.length - 1].replace(".mp3", "");
        }
        return (
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
                    {showName}&nbsp;
                    <FontAwesomeIcon icon={faFileAudio} />
                </Button>
            </ButtonGroup>
        );
    } else {
        return (
            <Button variant={"info"} disabled>
                {bgm.name}
            </Button>
        );
    }
}
