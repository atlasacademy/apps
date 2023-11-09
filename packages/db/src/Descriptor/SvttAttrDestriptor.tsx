import { useTranslation } from "react-i18next";

import { Attribute } from "@atlasacademy/api-connector";

export const SvtAttrDescriptor = ({ attribute }: { attribute: Attribute.Attribute }) => {
    const { t } = useTranslation();
    return <>{t("SvtAttribute." + attribute)}</>;
};
