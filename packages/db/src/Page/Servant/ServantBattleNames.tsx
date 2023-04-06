import { useTranslation } from "react-i18next";

import { Region, Servant } from "@atlasacademy/api-connector";

import { FGOText } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

const ServantBattleNames = ({ region, servant }: { region: Region; servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
            <h3>{t("Battle Names")}</h3>
            <ul>
                <li>
                    {t("Default Battle Name")}:{" "}
                    <span lang={lang(region)}>
                        <FGOText text={servant.battleName} />
                    </span>
                </li>
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.ascension).map(
                    ([ascension, battleName]) => (
                        <li key={ascension}>
                            {t("AscensionBeforeNumber")}
                            {ascension}
                            {t("AscensionAfterNumber")}:{" "}
                            <span lang={lang(region)}>
                                <FGOText text={battleName} />
                            </span>
                        </li>
                    )
                )}
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.costume).map(
                    ([battleCharaId, battleName]) => {
                        const custumeShortName = Object.values(servant.profile?.costume ?? {}).find(
                            (costume) => costume.id === parseInt(battleCharaId)
                        )?.shortName;
                        return (
                            <li key={battleCharaId}>
                                {t("Costume")}{" "}
                                <span lang={lang(region)}>
                                    {custumeShortName ? <FGOText text={custumeShortName} /> : battleCharaId}:{" "}
                                    <FGOText text={battleName} />
                                </span>
                            </li>
                        );
                    }
                )}
            </ul>
        </>
    );
};

export default ServantBattleNames;
