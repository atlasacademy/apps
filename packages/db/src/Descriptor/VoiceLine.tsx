class AudioElement {
    private element: HTMLAudioElement = new Audio();
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    load() {
        const element = new Audio(this.url);
        element.volume = 0.5;
        element.load();
        this.element = element;
    }

    play() {
        return new Promise((res) => {
            this.element.onpause =
                this.element.onerror =
                this.element.onended =
                    () => {
                        this.stop();
                        res(undefined);
                    };
            this.element.play().catch(() => {});
        });
    }

    stop() {
        this.element.pause();
        this.element.currentTime = 0;
    }
}

export class VoiceLine {
    private voiceLines: { audio: AudioElement; delay: number; assetUrl: string }[];
    current?: AudioElement;
    stopping?: boolean;
    handleNavigateAssetUrl?: (assetUrl: string) => void;

    constructor(assets: [string, number][], handleNavigateAssetUrl?: (assetUrl: string) => void) {
        this.voiceLines = assets.map((_) => ({ audio: new AudioElement(_[0]), delay: _[1], assetUrl: _[0] }));
        this.handleNavigateAssetUrl = handleNavigateAssetUrl;
    }

    async play() {
        this.current = this.voiceLines[0].audio;
        for (let { audio } of this.voiceLines) audio.load();
        for (let line of this.voiceLines) {
            if (this.stopping) break;
            await new Promise((resolve) => setTimeout(resolve, line.delay * 1000));
            this.current = line.audio;
            if (this.handleNavigateAssetUrl !== undefined) this.handleNavigateAssetUrl(line.assetUrl);
            await line.audio.play();
        }

        this.current = undefined;
        this.stopping = false;
    }

    async stop() {
        if (!this.current) return (this.stopping = false);
        this.stopping = true;
        this.current?.stop();
    }
}
