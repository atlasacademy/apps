// Thanks to crunker by jackedgson
// https://github.com/jackedgson/crunker/blob/master/src/crunker.js
import axios from "axios";

const padAudio = (audioContext: AudioContext, buffer: AudioBuffer, delay: number) => {
    if (delay === 0) {
        return buffer;
    }

    const delaySamples = Math.floor(delay * buffer.sampleRate);

    const newBuffer = audioContext.createBuffer(
        buffer.numberOfChannels,
        buffer.length + delaySamples,
        buffer.sampleRate
    );

    for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber += 1) {
        newBuffer.getChannelData(channelNumber).set(buffer.getChannelData(channelNumber), delaySamples);
    }

    return newBuffer;
};

const concatAudios = (context: AudioContext, buffers: AudioBuffer[]) => {
    const maxNumberOfChannels = Math.max(...buffers.map((buffer) => buffer.numberOfChannels));

    let totalLength = 0;
    for (let i = 0; i < buffers.length; i++) {
        totalLength += buffers[i].length;
    }

    const output = context.createBuffer(maxNumberOfChannels, totalLength, buffers[0].sampleRate);

    let offset = 0;
    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber += 1) {
            output.getChannelData(channelNumber).set(buffer.getChannelData(channelNumber), offset);
        }

        offset += buffer.length;
    }

    return output;
};

const interleave = (buffer: AudioBuffer) => {
    const outLength = buffer.length * buffer.numberOfChannels;
    let output = new Float32Array(outLength);
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const offset = i * buffer.numberOfChannels + channel;
            output[offset] = buffer.getChannelData(channel)[i];
        }
    }
    return output;
};

const writeString = (dataview: DataView, offset: number, header: string) => {
    for (var i = 0; i < header.length; i++) {
        dataview.setUint8(offset + i, header.charCodeAt(i));
    }
};

const writeWav = (buffer: AudioBuffer) => {
    const pcmData = interleave(buffer);

    // https://docs.fileformat.com/audio/wav/
    const wavType = 1;
    const wavNumberOfChannels = buffer.numberOfChannels;
    const wavSampleRate = buffer.sampleRate;
    const wavBitsPerSample = 16;
    const wavSamplesPerSec = wavSampleRate * (wavBitsPerSample / 8) * wavNumberOfChannels;
    const wavSamplingSizeInBytes = (wavBitsPerSample / 8) * wavNumberOfChannels;
    const wavDataSizeInBytes = pcmData.length * (wavBitsPerSample / 8);

    let arrayBuffer = new ArrayBuffer(44 + wavDataSizeInBytes),
        view = new DataView(arrayBuffer);

    writeString(view, 0, "RIFF");
    view.setUint32(4, wavDataSizeInBytes + 44 - 8, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, wavType, true);
    view.setUint16(22, wavNumberOfChannels, true);
    view.setUint32(24, wavSampleRate, true);
    view.setUint32(28, wavSamplesPerSec, true);
    view.setUint32(32, wavSamplingSizeInBytes, true);
    view.setUint16(34, wavBitsPerSample, true);

    writeString(view, 36, "data");
    view.setUint32(40, wavDataSizeInBytes, true);

    for (let i = 0; i < pcmData.length; i++) {
        let tmp = Math.max(-1, Math.min(1, pcmData[i]));
        view.setInt16(44 + i * 2, tmp < 0 ? tmp * 0x8000 : tmp * 0x7fff, true);
    }

    return view;
};

const mergeVoiceLine = async (audioAssetUrls: string[], delay: number[], fileName?: string) => {
    let AudioContext =
        window.AudioContext || // Default
        (window as any).webkitAudioContext || // Safari and old versions of Chrome
        false;

    if (AudioContext) {
        const audioContext = new AudioContext({ sampleRate: 44100 });

        try {
            const audioBuffers = await Promise.all(
                audioAssetUrls.map(async (audioUrl) => {
                    const buffer = await axios.get<ArrayBuffer>(audioUrl, {
                        responseType: "arraybuffer",
                    });
                    // Safari doesn't support Promise-based syntax of decodeAudioData
                    // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData#browser_compatibility
                    return new Promise<AudioBuffer>((res) => {
                        audioContext.decodeAudioData(buffer.data, (buffer) => res(buffer));
                    });
                })
            );

            let paddedAudioBuffers = [] as AudioBuffer[];
            for (let i = 0; i < audioBuffers.length; i++) {
                paddedAudioBuffers.push(padAudio(audioContext, audioBuffers[i], delay[i]));
            }

            const combinedAudio = concatAudios(audioContext, paddedAudioBuffers);
            const audioDataView = writeWav(combinedAudio);
            const audioBlob = new Blob([audioDataView], { type: "audio/wav" });

            const audioIds = audioAssetUrls.map((url) => {
                const splittedUrl = url.split("/");
                const fileName = splittedUrl[splittedUrl.length - 1];
                return fileName.split(".").slice(0, -1).join(".");
            });

            const a = document.createElement("a");
            a.href = URL.createObjectURL(audioBlob);
            a.download = `${fileName ?? "merged"} - ${audioIds.join("&")}.wav`;
            a.click();
        } catch (e) {
            alert("Failed to download some voice line parts.");
        }

        await audioContext.close();
    } else {
        alert("Please use the latest Chrome or Firefox version.");
    }
};

export default mergeVoiceLine;
