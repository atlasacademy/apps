import React from "react";
import {Form} from "react-bootstrap";
import {withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import BasicListEntity from "../../Api/Data/BasicListEntity";
import Region from "../../Api/Data/Region";
import SearchableSelect from "../../Component/SearchableSelect";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    id: number;
    servants: BasicListEntity[];
}

class ServantPicker extends React.Component<IProps> {
    private changeServant(id: number) {
        this.props.history.push(`/${this.props.region}/servant/${id}`);
    }

    render() {
        const servants = this.props.servants.slice().reverse(),
            servantLabels = new Map<number, string>(servants.map(servant => [
                servant.collectionNo,
                `${servant.collectionNo} - ${servant.name}`
            ]));

        return (
            <div>
                <form>
                    <Form.Group>
                        <Form.Label>Jump to:</Form.Label>
                        <SearchableSelect<number> id='servantPicker'
                                                  options={servants.map(servant => servant.collectionNo)}
                                                  labels={servantLabels}
                                                  selected={this.props.id}
                                                  hideAll={true}
                                                  hideReset={true}
                                                  disableLabelStyling={true}
                                                  maxResults={20}
                                                  onChange={(value?: number) => {
                                                      if (value) {
                                                          this.changeServant(value);
                                                      }
                                                  }}/>
                    </Form.Group>
                </form>
            </div>
        );
    }
}

export default withRouter(ServantPicker);
