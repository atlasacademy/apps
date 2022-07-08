import React from "react";
import { Form } from "react-bootstrap";
import { withTranslation, WithTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import SearchableSelect from "../../Component/SearchableSelect";
import { lang } from "../../Setting/Manager";

interface IProps extends RouteComponentProps, WithTranslation {
    region: Region;
    id: number;
    craftEssences: CraftEssence.CraftEssenceBasic[];
}

class CraftEssencePicker extends React.Component<IProps> {
    private changeCraftEssence(id: number) {
        this.props.history.push(`/${this.props.region}/craft-essence/${id}`);
    }

    render() {
        const t = this.props.t;
        const craftEssences = this.props.craftEssences.slice().reverse(),
            craftEssenceLabels = new Map<number, string>(
                craftEssences.map((craftEssences) => [
                    craftEssences.collectionNo,
                    `${craftEssences.collectionNo.toString().padStart(4, "0")} - ${craftEssences.name}`,
                ])
            );

        return (
            <div>
                <form>
                    <Form.Group>
                        <Form.Label>{t("Jump to")}:</Form.Label>
                        <SearchableSelect<number>
                            id="craftEssencePicker"
                            lang={lang(this.props.region)}
                            options={craftEssences.map((craftEssence) => craftEssence.collectionNo)}
                            labels={craftEssenceLabels}
                            selected={this.props.id}
                            selectedAsPlaceholder={true}
                            hideSelected={true}
                            hideReset={true}
                            disableLabelStyling={true}
                            maxResults={20}
                            onChange={(value?: number) => {
                                if (value) {
                                    this.changeCraftEssence(value);
                                }
                            }}
                        />
                    </Form.Group>
                </form>
            </div>
        );
    }
}

export default withRouter(withTranslation()(CraftEssencePicker));
