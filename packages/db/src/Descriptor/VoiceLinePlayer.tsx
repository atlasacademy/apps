import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";

import { VoiceLine } from "./VoiceLine";

import "./VoiceLinePlayer.css";

const VoiceLineStorage = new Map<string, VoiceLine>();

interface IProps {
    audioAssetUrls: string[];
    delay: number[];
    title: string;
    showTitle?: boolean;
    handleNavigateAssetUrl?: (assetUrl: string) => void;
}

interface IState {
    playing: boolean;
}

class VoiceLinePlayer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { playing: false };
        VoiceLineStorage.set(
            this.getVoiceLineKey(props.audioAssetUrls),
            new VoiceLine(
                props.audioAssetUrls.map((url, index) => [url, props.delay[index]]),
                this.props.handleNavigateAssetUrl
            )
        );
    }

    componentDidUpdate(prevProps: IProps) {
        // compare urls. stop if they change.
        let reset = () => {
            VoiceLineStorage.get(this.getVoiceLineKey(prevProps.audioAssetUrls))?.stop();
            VoiceLineStorage.delete(this.getVoiceLineKey(prevProps.audioAssetUrls));
            VoiceLineStorage.set(
                this.getVoiceLineKey(this.props.audioAssetUrls),
                new VoiceLine(
                    this.props.audioAssetUrls.map(
                        (url, index) => [url, this.props.delay[index]],
                        this.props.handleNavigateAssetUrl
                    )
                )
            );
        };

        if (this.props.audioAssetUrls.length !== prevProps.audioAssetUrls.length) return void reset();
        for (let index in this.props.audioAssetUrls)
            if (this.props.audioAssetUrls[index] !== prevProps.audioAssetUrls[index]) return void reset();
    }

    componentWillUnmount() {
        this.stop();
        VoiceLineStorage.delete(this.getVoiceLineKey(this.props.audioAssetUrls));
    }

    private onClick = async () => {
        const control = VoiceLineStorage.get(this.getVoiceLineKey(this.props.audioAssetUrls));
        if (this.state.playing) return control?.stop().then(() => this.setState({ playing: false }));

        this.setState({ playing: true });
        for (let [key, player] of VoiceLineStorage)
            if (key !== this.getVoiceLineKey(this.props.audioAssetUrls)) player.stop();
        control?.play().then(() => this.setState({ playing: false }));
    };

    private stop() {
        VoiceLineStorage.get(this.getVoiceLineKey(this.props.audioAssetUrls))?.stop();
        this.setState({ playing: false });
    }

    private getVoiceLineKey(urls: string[]) {
        // derive an unique key across voice lines
        return urls.join("|");
    }

    render() {
        const command = this.state.playing ? "Stop" : "Play";
        const title = `${command} ${this.props.title}`;
        return (
            <Button
                variant={this.state.playing ? "warning" : "success"}
                onClick={this.onClick}
                className="voice-line-player-button"
                title={title}
            >
                <FontAwesomeIcon icon={this.state.playing ? faStop : faPlay} />
                {this.props.showTitle ? <>&nbsp;{title}</> : null}
            </Button>
        );
    }
}

export default VoiceLinePlayer;
