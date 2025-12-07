import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

import { Region } from "@atlasacademy/api-connector";
import { SkillScript } from "@atlasacademy/api-connector/dist/Schema/Skill";

import SkillScriptCondDescriptor from "../Descriptor/SkillScriptCondDescriptor";
import { Renderable, asPercent } from "../Helper/OutputHelper";
import { lang } from "../Setting/Manager";

interface IProps extends WithTranslation {
    region: Region;
    scripts: SkillScript;
    levels?: number;
}

class ScriptBreakdown extends React.Component<IProps> {
    private displayRequirement(detail: string, values: Renderable[]): JSX.Element {
        return (
            <tr>
                <td className={"effect"}>
                    [{this.props.t("Requirement")}] {detail}
                </td>
                {this.props.levels
                    ? Array(this.props.levels)
                          .fill(null)
                          .map((_, i) => {
                              return <td key={i}>{values[i] ?? "-"}</td>;
                          })
                    : values.map((value, i) => {
                          return <td key={i}>{value}</td>;
                      })}
            </tr>
        );
    }

    private hpPerLowerRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.HP_PER_LOWER) return undefined;

        return this.displayRequirement(
            this.props.t("Health Percent Below"),
            this.props.scripts.HP_PER_LOWER.map((value) => asPercent(value, 1))
        );
    }

    private hpRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.HP_VAL_HIGHER) return undefined;

        return this.displayRequirement(this.props.t("Health"), this.props.scripts.HP_VAL_HIGHER);
    }

    private npRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.NP_HIGHER) return undefined;

        return this.displayRequirement(
            this.props.t("NP Gauge"),
            this.props.scripts.NP_HIGHER.map((value) => asPercent(value, 0))
        );
    }

    private starRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.STAR_HIGHER) return undefined;

        return this.displayRequirement(this.props.t("Critical Stars"), this.props.scripts.STAR_HIGHER);
    }

    private selectAddInfoOptions(): JSX.Element | null {
        const options = this.props.scripts.SelectAddInfo,
            t = this.props.t;
        if (!options) return null;

        const option = options[0];
        return (
            <tr>
                <td colSpan={(this.props.levels ?? 0) + 1}>
                    {t("Skill Options")}: <span lang={lang(this.props.region)}>{option.title}</span>
                    <ul className="mb-0">
                        {option.btn.map((btn, i) => (
                            <li key={i}>
                                {t("Option")} {i + 1}: <span lang={lang(this.props.region)}>{btn.name}</span>
                                {btn.imageUrl && (
                                    <img alt={`Option Icon ${i + 1}`} src={btn.imageUrl} style={{ height: "2em" }} />
                                )}{" "}
                                &mdash;{" "}
                                {btn.conds.map((cond, i) => (
                                    <SkillScriptCondDescriptor key={i} cond={cond.cond} value={cond.value} />
                                ))}
                            </li>
                        ))}
                    </ul>
                </td>
            </tr>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.hpPerLowerRequirements()}
                {this.hpRequirements()}
                {this.npRequirements()}
                {this.starRequirements()}
                {this.selectAddInfoOptions()}
            </React.Fragment>
        );
    }
}

export default withTranslation()(ScriptBreakdown);
