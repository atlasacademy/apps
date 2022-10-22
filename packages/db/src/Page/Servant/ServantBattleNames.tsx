import { useTranslation } from "react-i18next";

import { Servant } from "@atlasacademy/api-connector";

import { replacePUACodePoints } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";

const ServantBattleNames = ({ servant }: { servant: Servant.Servant }) => {
    const { t } = useTranslation();
    return (
        <>
            <h3>{t("Battle Names")}</h3>
            <ul>
                <li>
                    {t("Default Battle Name")}: <span lang={lang()}>{replacePUACodePoints(servant.battleName)}</span>
                </li>
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.ascension).map(
                    ([ascension, battleName]) => (
                        <li key={ascension}>
                            {t("AscensionBeforeNumber")}
                            {ascension}
                            {t("AscensionAfterNumber")}: <span lang={lang()}>{replacePUACodePoints(battleName)}</span>
                        </li>
                    )
                )}
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.costume).map(
                    ([battleCharaId, battleName]) => (
                        <li key={battleCharaId}>
                            {t("Costume")}{" "}
                            <span lang={lang()}>
                                {replacePUACodePoints(
                                    Object.values(servant.profile?.costume ?? {}).find(
                                        (costume) => costume.id === parseInt(battleCharaId)
                                    )?.shortName ?? battleCharaId
                                )}
                                : {replacePUACodePoints(battleName)}
                            </span>
                        </li>
                    )
                )}
            </ul>
        </>
    );
};

export default ServantBattleNames;
