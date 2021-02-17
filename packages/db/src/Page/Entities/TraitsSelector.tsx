import { Region, Trait } from "@atlasacademy/api-connector";
import { Typeahead } from "react-bootstrap-typeahead";
import TraitDescription from "../../Descriptor/TraitDescription";

interface Option {
    label: string;
    value: number;
    customOption?: boolean;
}

function isPositiveInteger(str: string) {
    return /^\d+$/.test(str);
}

function getTraitOption(trait: Trait.Trait): Option {
    const label = TraitDescription.renderAsString(trait);

    return {
        label: `${trait.id.toString().padStart(4, "0")} - ${label}`,
        value: trait.id,
    };
}

function getOptionList(
    traitNums: number[],
    knownTraits: Map<number, Trait.Trait>
): Option[] {
    return traitNums.map((traitNum) => {
        const trait = knownTraits.get(traitNum);
        if (trait !== undefined) {
            return getTraitOption(trait);
        } else {
            return {
                label: `${traitNum}`,
                value: traitNum,
            };
        }
    });
}

export default function TraitSelector(props: {
    region: Region;
    traitList: Trait.Trait[];
    initialTraits: number[];
    onUpdate: (traits: number[]) => void;
}) {
    const knownTraits = new Map(
        props.traitList.map((trait) => [trait.id, trait])
    );

    const options = props.traitList.map((trait) => getTraitOption(trait));
    let selectedOptions = getOptionList(props.initialTraits, knownTraits);

    return (
        <>
            <Typeahead
                id="trait-typeahead-multiple"
                multiple
                options={options}
                placeholder="Add a Trait or a positive integer"
                allowNew
                selected={selectedOptions}
                onChange={(selected) => {
                    const traitNums = selected
                        .filter(
                            (sel) =>
                                !sel.customOption ||
                                isPositiveInteger(sel.label)
                        )
                        .map((sel) =>
                            sel.customOption ? parseInt(sel.label) : sel.value
                        );
                    props.onUpdate(traitNums);
                    selectedOptions = getOptionList(traitNums, knownTraits);
                }}
            />
        </>
    );
}
