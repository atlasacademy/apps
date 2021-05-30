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

export class VoiceLine {
    private voiceLines: { audio: AudioElement, delay: number, assetUrl: string }[]
    current?: AudioElement;
    stopping?: boolean;
    handleNavigateAssetUrl?: (assetUrl: string) => void;

    constructor(assets : [string, number][], handleNavigateAssetUrl?: (assetUrl: string) => void) {
        this.voiceLines = assets.map(_ => ({ audio: new AudioElement(_[0]), delay: _[1], assetUrl: _[0] }));
        this.handleNavigateAssetUrl = handleNavigateAssetUrl;
    }

    async play() {
        for (let { audio } of this.voiceLines) await audio.load();
        for (let line of this.voiceLines) {
            if (this.stopping) break;
            await new Promise(resolve => setTimeout(resolve, line.delay * 1000));
            this.current = line.audio;
            if (this.handleNavigateAssetUrl !== undefined)
                this.handleNavigateAssetUrl(line.assetUrl);
            await line.audio.play();
        }

        this.current = undefined;
        this.stopping = false;
    }

    async stop() {
        if (!this.current) return this.stopping = false;
        this.stopping = true;
        this.current?.stop();
    }
}