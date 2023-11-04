import { useTranslation } from "react-i18next";

import { ClassName } from "@atlasacademy/api-connector";

export const SvtClassDescriptor = ({ svtClass }: { svtClass: ClassName }) => {
    const { t } = useTranslation();
    return <>{t("SvtClass." + svtClass)}</>;
};
