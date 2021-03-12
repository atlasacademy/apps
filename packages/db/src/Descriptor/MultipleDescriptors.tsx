import {
    ClassName,
    Item,
    Quest,
    Region,
    Servant,
} from "@atlasacademy/api-connector";
import { mergeElements } from "../Helper/OutputHelper";
import { IconDescriptorMap, ItemDescriptorId } from "./ItemDescriptor";
import { QuestDescriptorId } from "./QuestDescriptor";
import ServantDescriptorId from "./ServantDescriptorId";
import TraitDescription from "./TraitDescription";

export const missionRange = (missions: number[]) => {
    const max = Math.max(...missions);
    const min = Math.min(...missions);
    const missionSet = new Set(missions);
    let ranges: number[][] = [];
    let currentRange: number[] = [min];
    for (let i = min + 1; i <= max; i++) {
        if (missionSet.has(i)) {
            if (currentRange.length > 0) {
                currentRange.push(i);
            } else {
                currentRange = [i];
            }
        } else {
            if (currentRange.length > 0) {
                ranges.push(currentRange);
                currentRange = [];
            }
        }
    }
    ranges.push(currentRange);
    return ranges
        .map((range) => {
            const first = range[0];
            const last = range[range.length - 1];
            if (first === last) {
                return `${first}`;
            } else {
                return `${first}–${last}`;
            }
        })
        .join(", ");
};

export const MultipleQuests = (props: {
    region: Region;
    questIds: number[];
    quests?: Map<number, Quest.Quest>;
}) => {
    if (props.questIds.length === 1) {
        return (
            <QuestDescriptorId
                text=""
                region={props.region}
                questId={props.questIds[0]}
                questPhase={1}
                quests={props.quests}
                showType={false}
            />
        );
    } else {
        return (
            <ul style={{ marginBottom: 0 }}>
                {props.questIds.map((questId) => {
                    return (
                        <li key={questId}>
                            <QuestDescriptorId
                                text=""
                                region={props.region}
                                questId={questId}
                                questPhase={1}
                                quests={props.quests}
                                showType={false}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }
};

export const MultipleTraits = (props: {
    region: Region;
    traitIds: number[];
}) => {
    return (
        <>
            {mergeElements(
                props.traitIds.map((traitId) => (
                    <TraitDescription
                        key={traitId}
                        region={props.region}
                        trait={traitId}
                    />
                )),
                ", "
            )}
        </>
    );
};

export const MultipleItems = (props: {
    region: Region;
    itemIds: number[];
    items?: Map<number, Item.Item>;
}) => {
    return (
        <>
            {mergeElements(
                props.itemIds.map((itemId) => {
                    if (props.items !== undefined) {
                        return (
                            <IconDescriptorMap
                                region={props.region}
                                itemId={itemId}
                                items={props.items}
                            />
                        );
                    } else {
                        return (
                            <ItemDescriptorId
                                region={props.region}
                                itemId={itemId}
                            />
                        );
                    }
                }),
                ", "
            )}
        </>
    );
};

export const MultipleServants = (props: {
    region: Region;
    servantIds: number[];
    servants?: Map<number, Servant.ServantBasic>;
}) => {
    return (
        <>
            {mergeElements(
                props.servantIds.map((servantId) => (
                    <ServantDescriptorId
                        key={servantId}
                        region={props.region}
                        id={servantId}
                        servants={props.servants}
                    />
                )),
                " or "
            )}
        </>
    );
};

export const MultipleClasses = (props: {
    classIds: number[];
    classes?: { [key: string]: ClassName };
}) => {
    return (
        <>
            {mergeElements(
                props.classIds.map((classId) => {
                    const className = props.classes
                        ? props.classes[classId.toString()]?.toString()
                        : undefined;
                    return `${className ?? classId.toString()} class`;
                }),
                " or "
            )}
        </>
    );
};
