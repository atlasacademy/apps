import { Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { Region, Servant } from "@atlasacademy/api-connector";

import CondTargetValueDescriptor from "../../Descriptor/CondTargetValueDescriptor";
import { OrdinalNumeral } from "../../Helper/StringHelper";

const ServantLimitImage = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    if (servant.ascensionImage.length === 0) return <></>;
    return (
        <Alert variant="success">
            {t("Locked ascension image")}
            {servant.ascensionImage.length > 1 ? t("SforPlural") : ""}:
            <ul className="mb-0">
                {servant.ascensionImage.map((limitImage) => (
                    <li key={limitImage.limitCount}>
                        <OrdinalNumeral index={limitImage.limitCount} /> {t("AscensionAfterOrdinal")}:{" "}
                        {t("LimitImageBefore")} <OrdinalNumeral index={limitImage.defaultLimitCount} />{" "}
                        {t("AscensionAfterOrdinal")} {t("LimitImageAfter")}{" "}
                        <CondTargetValueDescriptor
                            region={region}
                            cond={limitImage.condType}
                            target={limitImage.condTargetId}
                            value={limitImage.condNum}
                        />
                    </li>
                ))}
            </ul>
        </Alert>
    );
};

export default ServantLimitImage;
