import { Region } from "@atlasacademy/api-connector";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { AssetHost } from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { parseScript } from "../Component/Script";
import ScriptTable from "../Component/ScriptTable";
import Manager from "../Setting/Manager";

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
        try {
            axios.get(scriptURL, { timeout: 10000 }).then((r) => {
                setScript(r.data);
                setLoading(false);
            });
        } catch (e) {
            setError(e);
        }
    }, [region, scriptURL]);

    if (loading) return <Loading />;

    if (error !== undefined) return <ErrorStatus error={error} />;

    if (script === "") return null;

    document.title = `[${region}] Script ${scriptId} - Atlas Academy DB`;

    const parsedScript = parseScript(script);

    return (
        <>
            <h1>Script {scriptId}</h1>
            <ScriptTable region={region} script={parsedScript} />
        </>
    );
};

export default ScriptPage;
