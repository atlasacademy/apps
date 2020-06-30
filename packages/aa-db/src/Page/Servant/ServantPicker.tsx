import React from "react";
import {FormControl} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import ServantListEntity from "../../Api/Data/ServantListEntity";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    id: number;
    servants: ServantListEntity[];
}

class ServantPicker extends React.Component<IProps> {
    private changeServant(id: number) {
        this.props.history.push(`/servant/${id}`);
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
                    {this.props.servants.map((servant, index) => {
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
