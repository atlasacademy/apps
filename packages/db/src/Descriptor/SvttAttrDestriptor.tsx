import { useTranslation } from "react-i18next";

import { Attribute } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";

export const SvtAttrDescriptor = ({ attribute }: { attribute: Attribute.Attribute }) => {
    const { t } = useTranslation();
    return <>{t("SvtAttribute." + attribute)}</>;
};

export const AttributeDescriptor = ({ attributeId }: { attributeId: number }) => {
    const { data: enumList } = useApi("enumList");
    if (enumList === undefined) return <></>;

    return <SvtAttrDescriptor attribute={enumList.Attribute[attributeId.toString()]} />;
};
