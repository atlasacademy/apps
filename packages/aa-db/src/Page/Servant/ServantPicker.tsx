import React from "react";
import {FormControl} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import Region from "../../Api/Data/Region";
import ServantListEntity from "../../Api/Data/ServantListEntity";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    servants: ServantListEntity[];
}

class ServantPicker extends React.Component<IProps> {
    private changeServant(id: number) {
        this.props.history.push(`/${this.props.region}/servant/${id}`);
    }

    render() {
        return (
            <div>
                Jump to:
                <FormControl as={"select"} custom
                             onChange={(ev: Event) => {
                                 this.changeServant(parseInt(ev.target.value));
                             }}
                             value={this.props.id}>
                    {this.props.servants.reverse().map((servant, index) => {
                        return (
                            <option key={index} value={servant.collectionNo}>
                                {servant.name}
                            </option>
                        );
                    })}
                </FormControl>
            </div>
        );
    }
}

export default withRouter(ServantPicker);
