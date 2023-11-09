import { useTranslation } from "react-i18next";

import { MysticCode } from "@atlasacademy/api-connector";

import CollapsibleContent from "../../Component/CollapsibleContent";

const Image = ({ url, alt, floatDir }: { url: string; alt?: string; floatDir?: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
        <img
            alt={alt ?? ""}
            src={url}
            className={"mw-100" + (floatDir !== undefined ? `float-${floatDir} w-50` : "")}
        />
    </a>
);

const MCImages = ({
    mcAssets,
    mcName,
    assetType,
    float,
}: {
    mcAssets: { male: string; female: string };
    mcName: string;
    assetType: "Figure" | "Face" | "Item";
    float?: boolean;
}) => (
    <>
        <Image url={mcAssets.male} alt={`Male ${mcName} ${assetType}`} floatDir={float ? "start" : undefined} />
        <Image url={mcAssets.female} alt={`Female ${mcName} ${assetType}`} floatDir={float ? "end" : undefined} />
    </>
);

const MysticCodeAssets = ({ mysticCode }: { mysticCode: MysticCode.MysticCode }) => {
    const { t } = useTranslation();
    const mcName = `${mysticCode.name} Mystic Code`;
    return (
        <>
            <CollapsibleContent
                title={t("Figures")}
                content={
                    <>
                        <MCImages
                            mcAssets={mysticCode.extraAssets.masterFigure}
                            mcName={mcName}
                            assetType="Face"
                            float
                        />
                        {mysticCode.costumes.map((costume, idx) => (
                            <MCImages
                                key={costume.id}
                                mcAssets={costume.extraAssets.masterFigure}
                                mcName={mcName}
                                assetType="Face"
                                float
                            />
                        ))}
                    </>
                }
                subheader={false}
            />
            <CollapsibleContent
                title={t("Faces")}
                content={
                    <>
                        <MCImages mcAssets={mysticCode.extraAssets.masterFace} mcName={mcName} assetType="Face" />
                        {mysticCode.costumes.map((costume) => (
                            <div>
                                <MCImages
                                    key={costume.id}
                                    mcAssets={costume.extraAssets.masterFace}
                                    mcName={mcName}
                                    assetType="Face"
                                />
                            </div>
                        ))}
                    </>
                }
                subheader={false}
                enableBottomMargin={false}
            />
            <CollapsibleContent
                title={t("Items")}
                content={<MCImages mcAssets={mysticCode.extraAssets.item} mcName={mcName} assetType="Item" />}
                subheader
                enableBottomMargin
            />
        </>
    );
};

export default MysticCodeAssets;
