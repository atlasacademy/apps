import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Quest, Region } from "@atlasacademy/api-connector";

import DataTable from "../../Component/DataTable";
import GiftDescriptor from "../../Descriptor/GiftDescriptor";
import QuestConsumeDescriptor from "../../Descriptor/QuestConsumeDescriptor";
import { QuestTypeDescription } from "../../Descriptor/QuestEnumDescription";
import { FGOText } from "../../Helper/StringHelper";
import { lang } from "../../Setting/Manager";
import PhaseNavigator from "./QuestPhaseNavigator";

const QuestMainData = (props: {
    region: Region;
    quest: Quest.QuestPhase;
    phase: number;
    setPhase: (phase: number) => void;
}) => {
    const quest = props.quest;
    const { t } = useTranslation();
    return (
        <DataTable
            responsive
            data={[
                { label: t("ID"), value: quest.id },
                {
                    label: t("Phases"),
                    value: (
                        <PhaseNavigator
                            region={props.region}
                            quest={quest}
                            currentPhase={props.phase}
                            setPhase={props.setPhase}
                        />
                    ),
                },
                { label: t("Type"), value: QuestTypeDescription.get(quest.type) ?? quest.type },
                {
                    label: t("Cost"),
                    value: (
                        <QuestConsumeDescriptor
                            region={props.region}
                            consumeType={quest.consumeType}
                            consume={quest.consume}
                            consumeItem={quest.consumeItem}
                        />
                    ),
                },
                {
                    label: t("Reward"),
                    value: (
                        <>
                            {quest.giftIcon ? (
                                <>
                                    <div key={`${quest.giftIcon}`}>
                                        <img
                                            alt={`Quest Reward ${quest.giftIcon} icon`}
                                            style={{ maxWidth: "100%", maxHeight: "2em" }}
                                            src={quest.giftIcon}
                                        />
                                        <br />
                                    </div>
                                </>
                            ) : null}
                            {quest.gifts.map((gift) => (
                                <div key={`${gift.objectId}-${gift.priority}`}>
                                    <GiftDescriptor region={props.region} gift={gift} />
                                    <br />
                                </div>
                            ))}
                        </>
                    ),
                },
                {
                    label: t("Repeatable"),
                    value:
                        quest.afterClear === Quest.QuestAfterClearType.REPEAT_LAST &&
                        props.phase === Math.max(...quest.phases)
                            ? "True"
                            : "False",
                },
                {
                    label: t("War"),
                    value: (
                        <Link to={`/${props.region}/war/${quest.warId}`} lang={lang(props.region)}>
                            {quest.warLongName}
                        </Link>
                    ),
                },
                {
                    label: t("Spot"),
                    value: (
                        <span lang={lang(props.region)}>
                            <FGOText text={quest.spotName} />
                        </span>
                    ),
                },
                { label: t("Open"), value: new Date(quest.openedAt * 1000).toLocaleString() },
                { label: t("Close"), value: new Date(quest.closedAt * 1000).toLocaleString() },
            ]}
        />
    );
};

export default QuestMainData;
