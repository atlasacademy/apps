import {Region, Trait} from "@atlasacademy/api-connector";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {RefObject} from "react";
import {Badge} from "react-bootstrap";
import {Typeahead} from "react-bootstrap-typeahead";
import TraitDescriptor, {traitDescriptions} from "../../Descriptor/TraitDescriptor";
import {mergeElements} from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    traitList: Trait[];
    traits: number[];
    onUpdate: (traits: number[]) => void;
}

interface IState {
    ref: RefObject<any>,
    input?: string,
}

class TraitsSelector extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            ref: React.createRef()
        };
    }

    private options() {
        return this.props.traitList.map(trait => {
            let label = traitDescriptions.get(trait.id) ?? `(${trait.name})`;

            return {
                label: `${trait.id.toString().padStart(4, '0')} - ${label}`,
                value: trait.id,
            };
        });
    }

    private resetInput() {
        this.setState({
            input: ''
        });

        this.state.ref.current.clear();
    }

    private addInputTrait() {
        const value = this.state.input;
        if (!value) {
            this.resetInput();
            return;
        }

        if (!value.match(/^[0-9]+$/)) {
            this.resetInput();
            return;
        }

        this.addTrait(parseInt(value));
        this.resetInput();
    }

    private addTrait(trait: number) {
        this.props.onUpdate(
            this.props.traits.concat([trait])
        );
    }

    private removeTrait(trait: number) {
        console.log(
            trait,
            this.props.traits.filter(_trait => _trait !== trait)
        );
        this.props.onUpdate(
            this.props.traits.filter(_trait => _trait !== trait)
        );
    }

    render() {
        return (
            <div>

                <p>
                    {this.props.traits.length > 0 ? mergeElements(this.props.traits.map(trait => (
                        <span key={trait}
                              style={{cursor: 'pointer'}}
                              onClick={(e) => {
                                  e.preventDefault();
                                  this.removeTrait(trait);
                              }}>
                            <Badge variant='primary'>
                                <TraitDescriptor region={this.props.region} trait={trait}/>
                                &nbsp;
                                <FontAwesomeIcon icon={faTimesCircle}/>
                            </Badge>
                        </span>
                    )), ' ') : <i>No Traits Selected</i>}
                </p>

                <Typeahead ref={this.state.ref}
                           id={'traitsSelector'}
                           options={this.options()}
                           placeholder='Add Trait Filter'
                           ignoreDiacritics={true}
                           selected={[]}
                           onBlur={() => {
                               this.resetInput();
                           }}
                           onChange={(selected) => {
                               if (selected.length > 0) {
                                   this.addTrait(selected[0].value);
                               }
                           }}
                           onInputChange={text => {
                               this.setState({input: text});
                           }}
                           onKeyDown={(e: any) => {
                               if (e.keyCode === 13) {
                                   this.addInputTrait();
                               }
                           }}/>

            </div>
        );
    }
}

export default TraitsSelector;
