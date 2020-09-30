import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button} from "react-bootstrap";

class AudioElement {
    private element: HTMLAudioElement = new Audio();
    private url: string;

    constructor(url: string) {
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

    stop = () => {
        this.element.pause();
        this.element.currentTime = 0;
    };
}

interface IProps {
    audioAssetUrls: string[];
    delay: number[];
}

interface IState {
    playing: boolean;
    control: AudioElement | undefined;
    started: number | undefined;
}

class VoiceLineAudioDescriptor extends React.Component<IProps, IState> {
    private readonly audioControllers: AudioElement[];

    constructor(props: IProps) {
        super(props);

        this.audioControllers = props.audioAssetUrls.map(url => new AudioElement(url));

        this.state = {
            playing: false,
            control: undefined,
            started: undefined
        };
    }

    private async onClick() {
        if (this.state.playing)
            return this.stop();

        const started = Date.now();

        await this.setState({
            playing: true,
            started
        });

        this.playLine(0, started);
    }

    private async playLine(index: number, started: number) {
        if (index >= this.audioControllers.length) {
            return this.stop();
        }

        const control = this.audioControllers[index];
        await this.setState({control});
        await control.play();

        if (started === this.state.started)
            this.playLine(index + 1, started);
    };

    private stop() {
        const control = this.state.control;

        this.setState({
            playing: false,
            control: undefined,
            started: undefined
        });

        control?.stop();
    }

    render() {
        return (
            <Button
                variant={this.state.playing ? 'warning' : 'success'}
                onClick={() => {
                    this.onClick();
                }}
                style={{whiteSpace: "nowrap"}}>
                <FontAwesomeIcon icon={this.state.playing ? faStop : faPlay}/>
                &nbsp;
                {this.state.playing ? 'Stop' : 'Play'}
            </Button>
        )
    }
}

export default VoiceLineAudioDescriptor;
