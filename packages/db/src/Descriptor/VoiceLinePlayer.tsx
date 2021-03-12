import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Button} from "react-bootstrap";

class AudioElement {
    private element: HTMLAudioElement = new Audio();
    private url: string;
    private loaded: boolean = false;

    constructor(url: string) {
        this.url = url;
    };

    load() {
        return new Promise(res => {
            if (this.loaded) {
                res(undefined);

                return;
            }

            const element = new Audio(this.url);
            element.volume = 0.5;

            element.addEventListener('loadeddata', () => {
                element.pause();
                element.currentTime = 0;
                this.loaded = true;

                res(undefined);
            });

            element.play();
            this.element = element;
        });
    }

    play() {
        return new Promise(res => {
            this.element.onpause = this.element.onerror = this.element.onended = () => {
                this.stop();
                res(undefined);
            };
            this.element.play();
        });
    }

    stop() {
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

class VoiceLinePlayer extends React.Component<IProps, IState> {
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

    componentDidUpdate(prevProps : IProps) {
        // compare urls. stop if they change.
        if (this.props.audioAssetUrls.length != prevProps.audioAssetUrls.length) return void this.stop();
        for (let index in this.props.audioAssetUrls)
            if (this.props.audioAssetUrls[index] != prevProps.audioAssetUrls[index]) return void this.stop();
    }

    componentWillUnmount() {
        this.stop();
    }

    private isPlaying(started: number): boolean {
        return this.state.playing && started === this.state.started;
    }

    private async onClick() {
        if (this.state.playing)
            return this.stop();

        const started = Date.now();

        await this.setState({
            playing: true,
            started
        });

        await Promise.all(this.audioControllers.map(async (control) => {
            await control.load();

            return;
        }));

        this.playLine(0, started);
    }

    private async playLine(index: number, started: number) {
        const control = this.audioControllers[index] ?? undefined,
            delay = this.props.delay[index] ?? undefined;

        if (!this.isPlaying(started) || !control || delay === undefined) {
            return this.stop();
        }

        await new Promise(resolve => {
            setTimeout(resolve, delay * 1000);
        });

        if (!this.isPlaying(started))
            return this.stop();

        this.setState({control});
        await control.play();

        if (this.isPlaying(started))
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
            </Button>
        )
    }
}

export default VoiceLinePlayer;
