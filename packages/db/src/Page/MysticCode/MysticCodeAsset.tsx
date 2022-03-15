import { MysticCode } from "@atlasacademy/api-connector";

const Image = ({ url, alt }: { url: string; alt?: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <img alt={alt ?? ""} src={url} style={{ maxWidth: "100%" }} />
    </a>
);

const MCImages = ({
    mcAssets,
    mcName,
    assetType,
}: {
    mcAssets: { male: string; female: string };
    mcName: string;
    assetType: "Figure" | "Face" | "Item";
}) => (
    <>
        <Image url={mcAssets.male} alt={`Male ${mcName} ${assetType}`} />
        <Image url={mcAssets.female} alt={`Female ${mcName} ${assetType}`} />
    </>
);

const MysticCodeAssets = ({ mysticCode }: { mysticCode: MysticCode.MysticCode }) => {
    const mcName = `${mysticCode.name} Mystic Code`;
    return (
        <>
            <h3>Figures</h3>
            <MCImages mcAssets={mysticCode.extraAssets.masterFigure} mcName={mcName} assetType="Face" />
            {mysticCode.costumes.map((costume) => (
                <MCImages
                    key={costume.id}
                    mcAssets={costume.extraAssets.masterFigure}
                    mcName={mcName}
                    assetType="Face"
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
