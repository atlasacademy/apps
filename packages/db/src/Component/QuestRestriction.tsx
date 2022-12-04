import { Quest, Region } from "@atlasacademy/api-connector";

import RestrictionDescription from "../Descriptor/RestrictionDescription";
import { lang } from "../Setting/Manager";

import "../Helper/StringHelper.css";

const QuestRestriction = ({
    region,
    questRestrictions,
}: {
    region: Region;
    questRestrictions: Quest.QuestPhaseRestriction[];
}) => {
    return (
        <>
            <ul className="mb-0">
                {questRestrictions.map((questRestriction) => (
                    <li key={questRestriction.restriction.id}>
                        <div className="newline" lang={lang(region)}>
                            <b>
                                {questRestriction.dialogMessage ||
                                    questRestriction.noticeMessage ||
                                    questRestriction.title ||
                                    questRestriction.restriction.name}
                            </b>
                            <br />
                            {questRestriction.noticeMessage && questRestriction.dialogMessage ? (
                                <>
                                    {questRestriction.noticeMessage}
                                    <br />
                                </>
                            ) : null}
                        </div>
                        <RestrictionDescription region={region} restriction={questRestriction.restriction} />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default QuestRestriction;
