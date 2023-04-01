import { MysticCode } from "@atlasacademy/api-connector";

import renderCollapsibleContent from "../../Component/CollapsibleContent";

const Image = ({ url, alt, floatDir }: { url: string; alt?: string; floatDir?: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <img alt={alt ?? ""} src={url} className={"mw-100" + floatDir ? `float-${floatDir} w-50` : ""} />
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
            {renderCollapsibleContent({
                title: "Figures",
                content: (
                    <>
                        {" "}
                        <MCImages
                            mcAssets={mysticCode.extraAssets.masterFigure}
                            mcName={mcName}
                            assetType="Face"
                            float={true}
                        />
                        {mysticCode.costumes.map((costume, idx) => (
                            <MCImages
                                key={costume.id}
                                mcAssets={costume.extraAssets.masterFigure}
                                mcName={mcName}
                                assetType="Face"
                                float={true}
                            />
                        ))}{" "}
                    </>
                ),
                subheader: false,
            })}
            {renderCollapsibleContent(
                {
                    title: "Faces",
                    content: (
                        <>
                            <MCImages mcAssets={mysticCode.extraAssets.masterFace} mcName={mcName} assetType="Face" />
                            {mysticCode.costumes.map((costume) => (
                                <MCImages
                                    key={costume.id}
                                    mcAssets={costume.extraAssets.masterFace}
                                    mcName={mcName}
                                    assetType="Face"
                                />
                            ))}
                        </>
                    ),
                    subheader: false,
                },
                false
            )}
            {renderCollapsibleContent(
                {
                    title: "Items",
                    content: <MCImages mcAssets={mysticCode.extraAssets.item} mcName={mcName} assetType="Item" />,
                    subheader: true,
                },
                true
            )}
        </>
    );
};

export default MysticCodeAssets;
