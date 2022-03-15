import React from "react";

import { Region } from "@atlasacademy/api-connector";
import { SkillScript } from "@atlasacademy/api-connector/dist/Schema/Skill";

import { asPercent, Renderable } from "../Helper/OutputHelper";

interface IProps {
    region: Region;
    scripts: SkillScript;
    levels?: number;
}

class ScriptBreakdown extends React.Component<IProps> {
    private displayRequirement(detail: string, values: Renderable[]): JSX.Element {
        return (
            <tr>
                <td className={"effect"}>[Requirement] {detail}</td>
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
            "Health Percent Below",
            this.props.scripts.HP_PER_LOWER.map((value) => asPercent(value, 1))
        );
    }

    private hpRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.HP_VAL_HIGHER) return undefined;

        return this.displayRequirement("Health", this.props.scripts.HP_VAL_HIGHER);
    }

    private npRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.NP_HIGHER) return undefined;

        return this.displayRequirement(
            "NP Gauge",
            this.props.scripts.NP_HIGHER.map((value) => asPercent(value, 0))
        );
    }

    private starRequirements(): JSX.Element | undefined {
        if (!this.props.scripts.STAR_HIGHER) return undefined;

        return this.displayRequirement("Critical Stars", this.props.scripts.STAR_HIGHER);
    }

    render() {
        return (
            <React.Fragment>
                {this.hpPerLowerRequirements()}
                {this.hpRequirements()}
                {this.npRequirements()}
                {this.starRequirements()}
            </React.Fragment>
        );
    }
}

export default ScriptBreakdown;
