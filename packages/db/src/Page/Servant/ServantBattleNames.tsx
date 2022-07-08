import { useTranslation } from "react-i18next";

import { Servant } from "@atlasacademy/api-connector";

import { lang } from "../../Setting/Manager";

const ServantBattleNames = ({ servant }: { servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
            <h3>{t("Battle Names")}</h3>
            <ul>
                <li>
                    {t("Default Battle Name")}: <span lang={lang()}>{servant.battleName}</span>
                </li>
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.ascension).map(
                    ([ascension, battleName]) => (
                        <li key={ascension}>
                            {t("AscensionBeforeNumber")}
                            {ascension}
                            {t("AscensionAfterNumber")}: <span lang={lang()}>{battleName}</span>
                        </li>
                    )
                )}
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.costume).map(
                    ([battleCharaId, battleName]) => (
                        <li key={battleCharaId}>
                            {t("Costume")}{" "}
                            <span lang={lang()}>
                                {Object.values(servant.profile?.costume ?? {}).find(
                                    (costume) => costume.id === parseInt(battleCharaId)
                                )?.shortName ?? battleCharaId}
                                : {battleName}
                            </span>
                        </li>
                    )
                )}
            </ul>
        </>
    );
};

export default ServantBattleNames;
