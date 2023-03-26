import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Profile, Servant } from "@atlasacademy/api-connector";

import { MergeElementsOr } from "../../Descriptor/MultipleDescriptors";
import { isSubset } from "../../Helper/ArrayHelper";
import { OrdinalNumeral } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

const VIEWER_URL = "https://katboi01.github.io/FateViewer/?id=";

interface AssetMap {
    [key: string]: string;
}

const ViewerLink = ({ battleCharaId, children }: { battleCharaId: string | number; children: React.ReactNode }) => {
    return (
        <a
            href={`${VIEWER_URL}${battleCharaId}`}
            target="_blank"
            rel="noreferrer"
            title="Go to model viewer by katboi01"
        >
            {children}&nbsp;
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
    );
};

const AscensionModelViewer = ({ assetMap }: { assetMap: AssetMap }) => {
    const { t } = useTranslation();
    const battleCharaAscensions = new Map<string, number[]>();
    for (const [ascension, url] of Object.entries(assetMap)) {
        const matched = url.match(/Servants\/([0-9]+)\//);
        if (matched !== null) {
            const battleCharaId = matched[1];
            if (battleCharaAscensions.has(battleCharaId)) {
                battleCharaAscensions.get(battleCharaId)!.push(Number(ascension));
            } else {
                battleCharaAscensions.set(battleCharaId, [Number(ascension)]);
            }
        }
    }

    return (
        <ul>
            {Array.from(battleCharaAscensions, ([battleCharaId, ascensions]) => {
                let ascensionString: string | React.ReactElement = `Ascension${
                    ascensions.length > 1 ? "s" : ""
                } ${ascensions.join(", ")}`;

                if (battleCharaAscensions.size === 1) {
                    ascensionString = t("All Ascensions");
                } else {
                    const perceivedAscensions: number[] = [];
                    let uncategorizedAscensionCount = ascensions.length;

                    if (ascensions.includes(0)) {
                        perceivedAscensions.push(1);
                        uncategorizedAscensionCount--;
                    }
                    if (isSubset(ascensions, [1, 2])) {
                        perceivedAscensions.push(2);
                        uncategorizedAscensionCount -= 2;
                    }
                    if (isSubset(ascensions, [3, 4])) {
                        perceivedAscensions.push(3);
                        uncategorizedAscensionCount -= 2;
                    }

                    if (perceivedAscensions.length > 0 && uncategorizedAscensionCount === 0) {
                        ascensionString = (
                            <>
                                <MergeElementsOr
                                    elements={perceivedAscensions.map((ascension) => (
                                        <OrdinalNumeral index={ascension} />
                                    ))}
                                    lastJoinWord={t("and")}
                                />{" "}
                                {t("AscensionAfterOrdinal")}
                                {perceivedAscensions.length > 1 ? t("SforPlural") : ""}
                            </>
                        );
                    }
                }

                return (
                    <li key={battleCharaId}>
                        <ViewerLink battleCharaId={battleCharaId}>{ascensionString}</ViewerLink>
                    </li>
                );
            })}
        </ul>
    );
};

const CostumeModelViewer = ({
    assetMap,
    costumeDetails,
}: {
    assetMap: AssetMap;
    costumeDetails: {
        [key: string]: Profile.CostumeDetail;
    };
}) => {
    return (
        <ul>
            {Object.keys(assetMap).map((battleCharaId) => (
                <li key={battleCharaId}>
                    <ViewerLink battleCharaId={battleCharaId}>
                        <span lang={lang()}>{costumeDetails[battleCharaId]?.shortName ?? battleCharaId}</span>
                    </ViewerLink>
                </li>
            ))}
        </ul>
    );
};

const ServantModelViewer = ({ servant }: { servant: Servant.Servant }) => {
    const { t } = useTranslation();
    const spriteModel = servant.extraAssets.spriteModel;
    if (spriteModel.ascension === undefined && spriteModel.costume === undefined) {
        return null;
    }

    return (
        <Alert variant="success">
            {t("Sprite Model")}:
            <ul className="mb-0">
                {spriteModel.ascension !== undefined ? (
                    <li>
                        {t("Base Model")}:
                        <AscensionModelViewer assetMap={spriteModel.ascension} />
                    </li>
                ) : null}
                {spriteModel.costume !== undefined && servant.profile?.costume !== undefined ? (
                    <li>
                        {t("Costume Model")}:
                        <CostumeModelViewer assetMap={spriteModel.costume} costumeDetails={servant.profile?.costume} />
                    </li>
                ) : null}
            </ul>
        </Alert>
    );
};

export default ServantModelViewer;
