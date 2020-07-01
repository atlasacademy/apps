import React from "react";
import {Form} from "react-bootstrap";
import Manager from "./Manager";
import {LanguageOption} from "./Option";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IState {
    language: LanguageOption
}

class SettingForm extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            language: Manager.language(),
        }

        Manager.onUpdate(() => this.syncSettings());
    }

    private syncSettings() {
        this.setState({
            language: Manager.language(),
        });
    }

    updateLanguage(value: string) {
        Manager.setLanguage(value);
    }

    render() {
        return (
            <div>
                <Form>
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
