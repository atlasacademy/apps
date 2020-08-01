import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {RefObject} from "react";
import {Typeahead} from "react-bootstrap-typeahead";

import "./SearchableSelect.css";

interface Option<T> {
    label: string,
    value?: T,
}

interface IProps<T> {
    id: string,
    options: T[],
    labels: Map<T, string>,
    onChange: Function,
    selected?: T,
}

interface IState<T> {
    ref: RefObject<any>,
    selected?: T,
    results: boolean,
}

class SearchableSelect<T> extends React.Component<IProps<T>, IState<T>> {
    constructor(props: IProps<T>) {
        super(props);

        this.state = {
            ref: React.createRef(),
            selected: props.selected,
            results: true,
        };
    }

    private async clearSelection() {
        await this.setState({selected: undefined, results: true});
        this.state.ref.current.clear();
    }

    private getOption(value?: T): Option<T> {
        if (value === undefined) {
            return {label: 'All', value};
        }

        const description = this.props.labels.get(value),
            label = description
                ? `${description} - ${value}`
                : `(${value})`;

        return {label, value};
    }

    private getOptions(): Option<T>[] {
        return [this.getOption()].concat(
            this.props.options.map(value => this.getOption(value))
        );
    }

    private resetInput() {
        if (this.state.results)
            return;

        this.setState({results: true});
    }

    private async selectOption(options: Option<T>[]) {
        if (options.length === 0) {
            this.setState({results: false});
        } else {
            const selected = options[0].value;

            await this.setState({selected, results: true});
            this.props.onChange(selected);
        }
    }

    render() {
        return (
            <Typeahead ref={this.state.ref}
                       id={this.props.id}
                       options={this.getOptions()}
                       placeholder={'All'}
                       selected={this.state.results && this.state.selected ? [this.getOption(this.state.selected)] : []}
                       ignoreDiacritics={true}
                       maxResults={1000}
                       onBlur={() => {
                           this.resetInput();
                       }}
                       onChange={(selected) => {
                           this.selectOption(selected);
                       }}>
                <button className='searchable-select-clear'
                        onClick={e => {
                            e.preventDefault();
                            this.clearSelection();
                        }}
                        onMouseDown={e => {
                            // Prevent input from losing focus.
                            e.preventDefault();
                        }}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
            </Typeahead>
        );
    }
}

export default SearchableSelect;
