import {
    ClassName,
    Item,
    Quest,
    Region,
    Servant,
} from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";
import { mergeElements, Renderable } from "../Helper/OutputHelper";
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

export const MergeElemetsOr = (props: {
    elements: Renderable[];
    lastJoinWord: string;
}) => {
    const { elements, lastJoinWord } = props;
    if (elements.length === 1) return <>{elements[0]}</>;

    return (
        <>
            {mergeElements(elements.slice(0, elements.length - 1), ", ")}{" "}
            {lastJoinWord} {elements[elements.length - 1]}
        </>
    );
};

export const MultipleQuests = (props: {
    region: Region;
    questIds: number[];
    quests?: Map<number, Quest.QuestBasic>;
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
    const renderedTraits = props.traitIds.map((traitId) => (
        <TraitDescription key={traitId} region={props.region} trait={traitId} />
    ));
    return <MergeElemetsOr elements={renderedTraits} lastJoinWord="and" />;
};

const shortItemNames = [
    {
        ids: [6001, 6002, 6003, 6004, 6005, 6006, 6007],
        name: "Gem",
    },
    {
        ids: [6101, 6102, 6103, 6104, 6105, 6106, 6107],
        name: "Magic Gem",
    },
    {
        ids: [6201, 6202, 6203, 6204, 6205, 6206, 6207],
        name: "Secret Gem",
    },
    {
        ids: [7001, 7002, 7003, 7004, 7005, 7006, 7007],
        name: "Piece",
    },
    {
        ids: [7101, 7102, 7103, 7104, 7105, 7106, 7107],
        name: "Monument",
    },
];

const checkSubset = (bigger: number[], smaller: number[]) => {
    for (const s of smaller) {
        if (!bigger.includes(s)) {
            return false;
        }
    }
    return true;
};

export const MultipleItems = (props: {
    region: Region;
    itemIds: number[];
    items?: Map<number, Item.Item>;
}) => {
    let toRenderItemIds = props.itemIds;
    const shortNames: Renderable[] = [];
    for (const shortItemName of shortItemNames) {
        if (checkSubset(props.itemIds, shortItemName.ids)) {
            shortNames.push(shortItemName.name);
            toRenderItemIds = toRenderItemIds.filter(
                (itemId) => !shortItemName.ids.includes(itemId)
            );
        }
    }
    const renderedItems = toRenderItemIds.map((itemId) => {
        if (props.items !== undefined) {
            return (
                <IconDescriptorMap
                    region={props.region}
                    itemId={itemId}
                    items={props.items}
                />
            );
        } else {
            return <ItemDescriptorId region={props.region} itemId={itemId} />;
        }
    });
    return (
        <MergeElemetsOr
            elements={shortNames.concat(renderedItems)}
            lastJoinWord="or"
        />
    );
};

export const MultipleServants = (props: {
    region: Region;
    servantIds: number[];
    servants?: Map<number, Servant.ServantBasic>;
}) => {
    const renderedServants = props.servantIds.map((servantId) => (
        <ServantDescriptorId
            key={servantId}
            region={props.region}
            id={servantId}
            servants={props.servants}
        />
    ));
    return <MergeElemetsOr elements={renderedServants} lastJoinWord="or" />;
};

export const MultipleClasses = (props: {
    classIds: number[];
    classes?: { [key: string]: ClassName };
}) => {
    const classNames = props.classIds.map((classId) => {
        const className = props.classes
            ? toTitleCase(props.classes[classId.toString()]?.toString())
            : undefined;
        return className ?? classId.toString();
    });
    return (
        <>
            <MergeElemetsOr elements={classNames} lastJoinWord="or" /> Class
        </>
    );
};
