import { Alert } from "react-bootstrap";

import { CommandCode, Entity, Region } from "@atlasacademy/api-connector";

import IllustratorDescriptor from "../../Descriptor/IllustratorDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";

const Image = ({ url, alt }: { url: string; alt?: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <img alt={alt ?? ""} src={url} style={{ maxWidth: "100%" }} />
    </a>
);

const CommnadCodeAsset = ({ commandCode, region }: { commandCode: CommandCode.CommandCode; region: Region }) => {
    const flattenAssets = (assetMap: Entity.EntityAssetMap | undefined): string[] => {
        if (!assetMap) return [];

        const assets = [];

        if (assetMap.cc) assets.push(...Object.values(assetMap.cc));

        return assets;
    };

    const displayAssets = (assetMap: Entity.EntityAssetMap | undefined, altName: string) => {
        const assets = flattenAssets(assetMap);

        return mergeElements(
            assets.map((asset) => <Image url={asset} alt={commandCode.name + " " + altName} />),
            ""
        );
    };
    return (
        <>
            <Alert variant="success">
                <IllustratorDescriptor region={region} illustrator={commandCode.illustrator} />
            </Alert>

            <h3>Potraits</h3>
            <div>{displayAssets(commandCode.extraAssets.charaGraph, "Potrait")}</div>

            <hr />

            <h3>Faces</h3>
            <div>{displayAssets(commandCode.extraAssets.faces, "Face")}</div>
        </>
    );
};

export default CommnadCodeAsset;
