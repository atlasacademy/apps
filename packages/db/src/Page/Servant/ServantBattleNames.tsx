import { Servant } from "@atlasacademy/api-connector";

import { lang } from "../../Setting/Manager";

const ServantBattleNames = ({ servant }: { servant: Servant.Servant }) => {
    return (
        <>
            <h3>Battle Names</h3>
            <ul>
                <li>
                    Default Battle Name: <span lang={lang()}>{servant.battleName}</span>
                </li>
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.ascension).map(
                    ([ascension, battleName]) => (
                        <li key={ascension}>
                            Ascension {ascension}: <span lang={lang()}>{battleName}</span>
                        </li>
                    )
                )}
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.costume).map(
                    ([battleCharaId, battleName]) => (
                        <li key={battleCharaId}>
                            Costume{" "}
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
