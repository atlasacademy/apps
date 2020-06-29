import React from "react";
import {Form} from "react-bootstrap";
import Manager from "./Manager";
import {LanguageOption, RegionOption} from "./Option";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IState {
    region: RegionOption,
    language: LanguageOption
}

class SettingForm extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            region: Manager.region(),
            language: Manager.language(),
        }

        Manager.onUpdate(() => this.syncSettings());
    }

    private syncSettings() {
        this.setState({
            region: Manager.region(),
            language: Manager.language(),
        });
    }

    updateLanguage(value: string) {
        Manager.setLanguage(value);
    }

    updateRegion(value: string) {
        Manager.setRegion(value);
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Region</Form.Label>
                        <Form.Control as={'select'} value={this.state.region}
                                      onChange={(ev: Event) => this.updateRegion(ev.target.value)}>
                            {Object.values(RegionOption).map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as={'select'} value={this.state.language}
                                      onChange={(ev: Event) => this.updateLanguage(ev.target.value)}>
                            {Object.values(LanguageOption).map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default SettingForm;
