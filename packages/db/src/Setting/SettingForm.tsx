import {Language} from "@atlasacademy/api-connector";
import React from "react";
import {Button, ButtonGroup, Form} from "react-bootstrap";
import Manager from "./Manager";
import {Theme} from "./Theme";

interface Event extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps {
    language: Language,
    theme: Theme
}

class SettingForm extends React.Component<IProps> {
    updateLanguage(value: string) {
        Manager.setLanguage(value);
    }

    updateTheme(value: string) {
        Manager.setTheme(value);
    }

    updateShopPlannerEnabled(value : boolean) {
        Manager.setShopPlannerEnabled(value);
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
                </Form>
                <ButtonGroup style={{ width: '100%' }}>
                    <Button
                        variant={Manager.shopPlannerEnabled() ? 'success' : 'secondary'}
                        onClick={() => this.updateShopPlannerEnabled(!Manager.shopPlannerEnabled())}>
                        Shop planner : {Manager.shopPlannerEnabled() ? 'Enabled' : 'Disabled'}
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default SettingForm;
