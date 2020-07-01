import React from "react";
import {FormControl} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Region from "../../Api/Data/Region";
import BasicListEntity from "../../Api/Data/BasicListEntity";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    craftEssences: BasicListEntity[];
}

class CraftEssencePicker extends React.Component<IProps> {
    private changeCraftEssence(id: number) {
        this.props.history.push(`/${this.props.region}/craft-essence/${id}`);
    }

    render() {
        return (
            <div>
                Jump to:
                <FormControl as={"select"} custom
                             onChange={(ev: Event) => {
                                 this.changeCraftEssence(parseInt(ev.target.value));
                             }}
                             value={this.props.id}>
                    {this.props.craftEssences.reverse().map((craftEssence, index) => {
                        return (
                            <option key={index} value={craftEssence.collectionNo}>
                                {craftEssence.name}
                            </option>
                        );
                    })}
                </FormControl>
            </div>
        );
    }
}

export default withRouter(CraftEssencePicker);
