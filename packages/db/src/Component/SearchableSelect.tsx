import { Typeahead } from "react-bootstrap-typeahead";

import "./SearchableSelect.css";

interface Option<T> {
    label: string;
    value: T;
}

interface IProps<T> {
    id: string;
    options: T[];
    labels: Map<T, string>;
    onChange: Function;
    selected?: T;
    selectedAsPlaceholder?: boolean;
    hideSelected?: boolean;
    hideReset?: boolean;
    disableLabelStyling?: boolean;
    maxResults?: number;
}

function getDescription<T>(value: T, labels: Map<T, string>, disableLabelStyling?: boolean): string {
    const description = labels.get(value);

    if (disableLabelStyling) {
        if (description) return description;
        return typeof value === "string" ? value : "Unknown";
    }

    return description ? `${description} - ${value}` : `(${value})`;
}

function getOptions<T>(options: T[], labels: Map<T, string>, disableLabelStyling?: boolean): Option<T>[] {
    return options.map((value) => {
        const label = getDescription(value, labels, disableLabelStyling);
        return { label, value };
    });
}

export default function SearchableSelect<T>(props: IProps<T>) {
    const options = getOptions(
        props.hideSelected ? props.options.filter((option) => option !== props.selected) : props.options,
        props.labels,
        props.disableLabelStyling
    );

    let selectedOptions: Option<T>[] = [];
    if (props.selected) {
        selectedOptions = getOptions([props.selected], props.labels, props.disableLabelStyling);
    }

    return (
        <>
            <Typeahead
                id="basic-typeahead-single"
                options={options}
                selected={props.selectedAsPlaceholder ? undefined : selectedOptions}
                placeholder={
                    props.selectedAsPlaceholder && selectedOptions.length > 0 ? selectedOptions[0].label : "All"
                }
                clearButton={props.hideReset ? !props.hideReset : true}
                maxResults={props.maxResults ?? 1000}
                onChange={(selected) => {
                    if (selected.length === 0) {
                        props.onChange(undefined);
                    } else {
                        props.onChange(selected[0].value);
                    }
                }}
            />
        </>
    );
}
