import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { VoiceLine } from "./VoiceLine";
import "./VoiceLinePlayer.css";

interface VoiceLineStorageEntry {
    states: {
        player: VoiceLine,
        playing: { playing: boolean, setPlaying: (playing: boolean) => void }
    }
}

const VoiceLineStorage = new Map<string, VoiceLineStorageEntry>();

interface IProps extends WithTranslation {
    audioAssetUrls: string[];
    delay: number[];
    title: string;
    showTitle?: boolean;
    handleNavigateAssetUrl?: (assetUrl: string) => void;
}

const getVoiceLineKey = (urls: string[]): string => urls.join("|");

const VoiceLinePlayer: React.FC<IProps> = (props) => {
    const { audioAssetUrls, delay, title, showTitle, handleNavigateAssetUrl } = props
    
    const [playing, setPlaying] = useState<boolean>(false);
    const [prevProps, setPrevProps] = useState<IProps>()
    const [currentAssetKey] = useState<string>(getVoiceLineKey(audioAssetUrls))
    const [currentPlayer] = useState<VoiceLine>(new VoiceLine(audioAssetUrls.map((url, index) => [url, delay[index]]), handleNavigateAssetUrl))
    

    VoiceLineStorage.set(currentAssetKey, {
        states: {
            player: currentPlayer,
            playing: { playing, setPlaying }
        }
    })

    const stopOtherPlay = () => {
        for (const [key, entry] of VoiceLineStorage) {
            if (key !== currentAssetKey) {
                entry.states.player.stop()
                entry.states.playing.setPlaying(false)
            }
        }
    }
    
    const handlePlay = () => {
        playing ? currentPlayer?.stop() : currentPlayer?.play()
        playing ? setPlaying(false) : setPlaying(true)
        
        if (!playing) void stopOtherPlay();
    }

    useEffect(() => {
        const reset = async (prevProps?: IProps) => {
            if (!prevProps) return;
    
            const prevAssetsKey = getVoiceLineKey(prevProps.audioAssetUrls)
            const prevPlayer = VoiceLineStorage.get(prevAssetsKey)
            await prevPlayer?.states.player.stop()
    
            VoiceLineStorage.delete(prevAssetsKey)
            VoiceLineStorage.set(currentAssetKey, {
                states: {
                    player: currentPlayer,
                    playing: { playing, setPlaying }
                }
            })
        }

        if (!prevProps) return setPrevProps(props)

        if (prevProps?.audioAssetUrls.length !== props.audioAssetUrls.length) {
            setPrevProps(props)
            return void reset(prevProps)
        }

        for (const index in props.audioAssetUrls) {
            const currentAudioAssetUrl = props.audioAssetUrls[index]
            const previusAudioAssetUrl = prevProps.audioAssetUrls[index]

            if (currentAudioAssetUrl !== previusAudioAssetUrl) {
                setPrevProps(props)
                return void reset()
            }
        }

        return () => {
            currentPlayer.stop()
            setPlaying(false)
        }
    }, [props, prevProps, currentAssetKey, currentPlayer, playing])

    return (
        <Button 
            variant={playing ? "warning" : "success"}
            onClick={handlePlay}
            className="voice-line-player-button"
            title={playing ? `${props.t("Play")} ${title} ` : `${props.t("Stop")} ${title}`}
        >
                <FontAwesomeIcon icon={ playing ? faStop : faPlay } />
                {showTitle ? <>&nbsp;{title}</> : null}
        </Button>
    )
} 



export default withTranslation()(VoiceLinePlayer);
