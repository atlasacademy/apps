import React from "react";
import {Button} from "react-bootstrap";

class AudioElement {
    private element : HTMLAudioElement = new Audio();
    private url : string;
    constructor(url : string) {
        this.url = url;
    };

    play = async () => {
        return new Promise(res => {
            this.element = new Audio(this.url);
            this.element.volume = 0.5;
            this.element.onpause = this.element.onerror = this.element.onended = () => {
                this.element.currentTime = 0;
                res();
            };
            this.element.load();
            this.element.play();
        })
    }

    stop = () => this.element.pause();
}

interface VoiceLineAudioDescriptorProps {
    audioAssetUrls: string[];
    delay: number[];
    onPlayStateChange: (playing: string) => void;
    playing?: string;
    id: string;
}

export default function (props: VoiceLineAudioDescriptorProps) {
    const { audioAssetUrls, id, delay, playing, onPlayStateChange } = props;
    const audioControllers = audioAssetUrls.map(url => new AudioElement(url));
    const onClick = async () => {
        onPlayStateChange(id);
        for (let [index, control] of audioControllers.entries()) {
            await new Promise(res => setTimeout(res, delay[index] * 1000));
            await control.play();
        }
        onPlayStateChange('');
    }

    const isMePlaying = id === playing;
    return (
        <Button
            disabled={!!props.playing}
            variant={isMePlaying ? 'warning' : 'success'}
            onClick={onClick}>
            Play
        </Button>
    )
}