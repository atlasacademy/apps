import {Language} from "@atlasacademy/api-connector";
import React from "react";
import {Form} from "react-bootstrap";
import Manager from "./Manager";
import {Theme} from "./Theme";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    language: Language,
    theme: Theme,
    changelogVisibleOnly: boolean;
}

class SettingForm extends React.Component<IProps> {
    updateLanguage(value: string) {
        Manager.setLanguage(value);
    }

    updateTheme(value: string) {
        Manager.setTheme(value);
    }

    updateChangelogVisibleOnly(value : number) {
        Manager.setChangelogVisibleOnly(!!+value);
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Control as={'select'} value={this.props.language}
                                      onChange={(ev: Event) => this.updateLanguage(ev.target.value)}>
                            {Object.values(Language).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Theme</Form.Label>
                        <Form.Control as={'select'} value={this.props.theme}
                                      onChange={(ev: Event) => this.updateTheme(ev.target.value)}>
                            {Object.values(Theme).map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Only show entries with visible changes in changelog</Form.Label>
                        <Form.Control as={'select'} value={+!!this.props.changelogVisibleOnly}
                                      onChange={(ev: Event) => this.updateChangelogVisibleOnly(+ev.target.value)}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
        );
    }
}

export default SettingForm;
