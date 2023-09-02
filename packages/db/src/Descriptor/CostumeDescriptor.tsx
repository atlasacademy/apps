import { useTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";

import useApi from "../Hooks/useApi";
import { lang } from "../Setting/Manager";
import ServantDescriptor from "./ServantDescriptor";

export default function CostumeDescriptor(props: {
    region: Region;
    servantId: number;
    costumeLimit: number;
    iconHeight?: number;
    tab?: string;
}) {
    const { data: servant } = useApi("servant", props.servantId);
    const { t } = useTranslation();

    if (servant === undefined) return null;

    let costume = undefined;
    if (servant.profile !== undefined) {
        costume = Object.values(servant.profile.costume).find((costume) => costume.id === props.costumeLimit);
    }
    return (
        <>
            <ServantDescriptor
                region={props.region}
                servant={servant}
                iconHeight={props.iconHeight}
                tab={props.tab ?? "lore"}
            />{" "}
            {t("costume")}: <span lang={lang(props.region)}>{costume?.shortName ?? props.costumeLimit}</span>
        </>
    );
}
