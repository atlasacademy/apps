import { Servant } from "@atlasacademy/api-connector";

const ServantBattleNames = ({ servant }: { servant: Servant.Servant }) => {
    return (
        <>
            <h3>Battle Names</h3>
            <ul>
                <li>Default Battle Name: {servant.battleName}</li>
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.ascension).map(
                    ([ascension, battleName]) => (
                        <li key={ascension}>
                            Ascension {ascension}: {battleName}
                        </li>
                    )
                )}
                {Object.entries(servant.ascensionAdd.overWriteServantBattleName.costume).map(
                    ([battleCharaId, battleName]) => (
                        <li key={battleCharaId}>
                            Costume{" "}
                            {Object.values(servant.profile?.costume ?? {}).find(
                                (costume) => costume.id === parseInt(battleCharaId)
                            )?.shortName ?? battleCharaId}
                            : {battleName}
                        </li>
                    )
                )}
            </ul>
        </>
    );
};

export default ServantBattleNames;
