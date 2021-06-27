import { Region } from "@atlasacademy/api-connector";
import axios, { AxiosError } from "axios";
import { createRef, useEffect, useState } from "react";
import { AssetHost } from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import ScriptTable from "../Component/ScriptTable";
import VoiceLinePlayer from "../Descriptor/VoiceLinePlayer";
import Manager from "../Setting/Manager";
import {
    parseScript,
    ScriptComponent,
    ScriptComponentType,
} from "../Component/Script";

const getScriptAssetURL = (region: Region, scriptId: string) => {
    let scriptPath = "";
    if (scriptId[0] === "0" || scriptId[0] === "9") {
        if (scriptId.slice(0, 2) === "94") {
            scriptPath = `94/${scriptId.slice(0, 4)}/${scriptId}`;
        } else {
            scriptPath = `${scriptId.slice(0, 2)}/${scriptId}`;
        }
    } else {
        scriptPath = `Common/${scriptId}`;
    }
    return `${AssetHost}/${region}/Script/${scriptPath}.txt`;
};

const ScriptPage = (props: { region: Region; scriptId: string }) => {
    const { region, scriptId } = props;
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | undefined>(undefined);
    const [script, setScript] = useState<string>("");

    const scriptURL = getScriptAssetURL(region, scriptId);

    useEffect(() => {
        Manager.setRegion(region);
        axios
            .get(scriptURL, { timeout: 10000 })
            .then((r) => setScript(r.data))
            .catch((e) => setError(e));
        setLoading(false);
    }, [region, scriptURL]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (script === "") return null;

    document.title = `[${region}] Script ${scriptId} - Atlas Academy DB`;

    const parsedScript = parseScript(region, script);

    const audioUrls = [] as string[];
    const addAudioUrls = (component: ScriptComponent) => {
        switch (component.type) {
            case ScriptComponentType.DIALOGUE:
                if (component.voice !== undefined)
                    audioUrls.push(component.voice.audioAsset);
                break;
            case ScriptComponentType.SOUND_EFFECT:
                audioUrls.push(component.soundEffect.audioAsset);
                break;
        }
    };
    for (const component of parsedScript.components) {
        switch (component.type) {
            case ScriptComponentType.CHOICES:
                for (const choice of component.choices) {
                    for (const choiceComponent of choice.results) {
                        addAudioUrls(choiceComponent);
                    }
                }
                break;
            default:
                addAudioUrls(component);
        }
    }
    const scrollRefs = new Map(
        audioUrls.map((url) => [url, createRef<HTMLTableRowElement>()])
    );
    for (const component of parsedScript.components) {
        if (component.type === ScriptComponentType.LABEL) {
            scrollRefs.set(component.name, createRef<HTMLTableRowElement>());
        }
    }

    const scrollToRow = (assetUrl: string) => {
        let rowRef = scrollRefs.get(assetUrl);
        if (rowRef !== undefined && rowRef.current !== null) {
            rowRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <h1>Script {scriptId}</h1>
            {audioUrls.length > 0 ? (
                <div style={{ margin: "1em 0" }}>
                    <VoiceLinePlayer
                        audioAssetUrls={audioUrls}
                        delay={new Array(audioUrls.length).fill(0).fill(1, 1)}
                        title="all audio files"
                        showTitle
                        handleNavigateAssetUrl={scrollToRow}
                    />
                </div>
            ) : null}
            <ScriptTable
                region={region}
                script={parsedScript}
                refs={scrollRefs}
            />
        </>
    );
};

export default ScriptPage;
