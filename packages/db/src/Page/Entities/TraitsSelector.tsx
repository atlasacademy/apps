import { Region, Trait } from "@atlasacademy/api-connector";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import TraitDescription from "../../Descriptor/TraitDescription";

function getOptions(traitList: Trait.Trait[]) {
    return traitList.map((trait) => {
        const label = TraitDescription.renderAsString(trait);

        return {
            label: `${trait.id.toString().padStart(4, "0")} - ${label}`,
            value: trait.id,
        };
    });
}

export default function TraitSelector(props: {
    region: Region;
    traitList: Trait.Trait[];
    initialTraits: number[];
    onUpdate: (traits: number[]) => void;
}) {
    const [selectedTraits, setSelectedTraits] = useState([] as number[]);

    const options = getOptions(props.traitList);
    let selectedOptions = getOptions(
        props.traitList.filter((trait) =>
            props.initialTraits.includes(trait.id)
        )
    );

    return (
        <>
            <Typeahead
                id="basic-typeahead-single"
                multiple
                options={options}
                placeholder="Add Trait Filter"
                selected={selectedOptions}
                onChange={(selected) => {
                    const traitNumbers = selected.map((sel) => sel.value);
                    setSelectedTraits(traitNumbers);
                    props.onUpdate(traitNumbers);
                    selectedOptions = getOptions(
                        props.traitList.filter((trait) =>
                            selectedTraits.includes(trait.id)
                        )
                    );
                }}
            />
        </>
    );
}
