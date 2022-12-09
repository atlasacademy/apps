import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import { lang } from "../Setting/Manager";

const IllustratorDescriptor = (props: { region: Region; illustrator?: string; hideTypeText?: boolean }) => {
    const { region, illustrator, hideTypeText } = props;
    const query = illustrator === undefined ? "" : `?illustrator=${encodeURIComponent(illustrator)}`;
    const { t } = useTranslation();
    return (
        <>
            {hideTypeText ? null : <>{t("Illustrator")}:&nbsp;</>}
            <Link to={`/${region}/entities${query}`} lang={lang(region)}>
                {illustrator}
            </Link>
        </>
    );
};

export default IllustratorDescriptor;
