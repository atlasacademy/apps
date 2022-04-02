import { MysticCode } from "@atlasacademy/api-connector";

const Image = ({ url, alt, floatDir }: { url: string; alt?: string; floatDir?: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <img alt={alt ?? ""} src={url} style={{ maxWidth: "100%" }} className={floatDir && `float-${floatDir} w-50`} />
    </a>
);

const MCImages = ({
    mcAssets,
    mcName,
    assetType,
    float = undefined,
}: {
    mcAssets: { male: string; female: string };
    mcName: string;
    assetType: "Figure" | "Face" | "Item";
    float?: true;
}) => (
    <>
        <Image url={mcAssets.male} alt={`Male ${mcName} ${assetType}`} floatDir={float && "start"} />
        <Image url={mcAssets.female} alt={`Female ${mcName} ${assetType}`} floatDir={float && "end"} />
    </>
);

const MysticCodeAssets = ({ mysticCode }: { mysticCode: MysticCode.MysticCode }) => {
    const mcName = `${mysticCode.name} Mystic Code`;
    return (
        <>
            <h3>Figures</h3>
            <MCImages mcAssets={mysticCode.extraAssets.masterFigure} mcName={mcName} assetType="Face" float={true} />
            {mysticCode.costumes.map((costume, idx) => (
                <MCImages
                    key={costume.id}
                    mcAssets={costume.extraAssets.masterFigure}
                    mcName={mcName}
                    assetType="Face"
                    float={true}
                />
            ))}
            <hr />

            <h3>Faces</h3>
            <MCImages mcAssets={mysticCode.extraAssets.masterFace} mcName={mcName} assetType="Face" />
            {mysticCode.costumes.map((costume) => (
                <MCImages key={costume.id} mcAssets={costume.extraAssets.masterFace} mcName={mcName} assetType="Face" />
            ))}

            <hr />

            <h3>Items</h3>
            <MCImages mcAssets={mysticCode.extraAssets.item} mcName={mcName} assetType="Item" />
        </>
    );
};

export default MysticCodeAssets;
