import { Typeahead } from "react-bootstrap-typeahead";
import { useTranslation } from "react-i18next";

import "./SearchableSelect.css";

interface Option<T> {
    label: string;
    niceLabel?: string;
    value: T;
}

interface IProps<T> {
    id: string;
    options: T[];
    labels: Map<T, string>;
    niceLabels?: Map<T, string>;
    onChange: Function;
    multiple?: boolean;
    selected?: T;
    selectedAsPlaceholder?: boolean;
    hideSelected?: boolean;
    hideReset?: boolean;
    disableLabelStyling?: boolean;
    maxResults?: number;
    lang?: string;
}

interface IPropsMultiple<T> extends Omit<IProps<T>, "selected"> {
    multiple: true;
    selected?: T[];
}

function getDescription<T>(value: T, labels: Map<T, string>, disableLabelStyling?: boolean): string {
    const description = labels.get(value);

    if (disableLabelStyling) {
        if (description) return description;
        return typeof value === "string" ? value : "Unknown";
    }

    return description ? `${description} - ${value}` : `(${value})`;
}

function getOptions<T>(
    options: T[],
    labels: Map<T, string>,
    disableLabelStyling?: boolean,
    niceLabels?: Map<T, string>
): Option<T>[] {
    return options.map((value) => {
        const label = getDescription(value, labels, disableLabelStyling);
        return { label, value, niceLabel: niceLabels ? niceLabels.get(value) : undefined };
    });
}

export default function SearchableSelect<T>(props: IProps<T> | IPropsMultiple<T>) {
    const options = getOptions(
        props.hideSelected ? props.options.filter((option) => option !== props.selected) : props.options,
        props.labels,
        props.disableLabelStyling,
        props.niceLabels
    );

    let selectedOptions: Option<T>[] = [];
    if (props.selected !== undefined) {
        selectedOptions = getOptions(
            props.multiple === true ? (props.selected as T[]) : [props.selected],
            props.labels,
            props.disableLabelStyling,
            props.niceLabels
        );
    }
    const { t } = useTranslation();

    return (
        <div lang={props.lang}>
            <Typeahead
                id="basic-typeahead-single"
                multiple={props.multiple}
                options={options}
                selected={props.selectedAsPlaceholder ? undefined : selectedOptions}
                placeholder={
                    props.selectedAsPlaceholder && selectedOptions.length > 0
                        ? (selectedOptions[0].niceLabel ?? selectedOptions[0].label)
                        : t("All")
                }
                clearButton={props.hideReset ? !props.hideReset : true}
                maxResults={props.maxResults ?? 1000}
                onChange={(selected) => {
                    if (selected.length === 0) {
                        props.multiple === true ? props.onChange([]) : props.onChange(undefined);
                    } else {
                        props.multiple === true
                            ? props.onChange(selected.map((sel) => (sel as Option<T>).value))
                            : props.onChange((selected[0] as Option<T>).value);
                    }
                }}
                renderMenuItemChildren={(option) => {
                    return <>{(option as Option<T>).niceLabel ?? (option as Option<T>).label}</>;
                }}
            />
        </div>
    );
}
