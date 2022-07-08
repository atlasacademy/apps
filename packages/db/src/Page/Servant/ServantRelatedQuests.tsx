import { useTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";

import QuestDescriptor from "../../Descriptor/QuestDescriptor";

const ServantRelatedQuests = (props: { region: Region; questIds: number[]; title?: string }) => {
    const { t } = useTranslation();
    if (props.questIds.length > 0) {
        return (
            <>
                <h3>{props.title ?? t("Servant Quest")}</h3>
                <ul>
                    {props.questIds.map((questId) => (
                        <li key={questId}>
                            <QuestDescriptor region={props.region} questId={questId} />
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        return null;
    }
};

export default ServantRelatedQuests;
