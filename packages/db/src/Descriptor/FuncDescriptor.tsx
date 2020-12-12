import {DataVal, Func, Region} from "@atlasacademy/api-connector";
import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import {
    getDataValList,
    getFollowerDataValList,
    getStaticFieldValues,
    getTargetFollowerVersionValues,
    getTargetVersionValues,
    hasFollowerDataVals
} from "../Helper/FuncHelper";
import {joinElements, Renderable} from "../Helper/OutputHelper";
import {FuncDescriptorSections} from "./Func/FuncDescriptorSections";
import handleActionSection from "./Func/handleActionSection";
import handleAffectsSection from "./Func/handleAffectsSection";
import handleAmountSection from "./Func/handleAmountSection";
import handleChanceSection from "./Func/handleChanceSection";
import handleDurationSection from "./Func/handleDurationSection";
import handleScalingSection from "./Func/handleScalingSection";
import handleTargetSection from "./Func/handleTargetSection";
import handleTeamSection from "./Func/handleTeamSection";
import handleOnFieldSection from "./Func/handleOnFieldSection";

interface IProps {
    region: Region;
    func: Func.Func;
    level?: number;
    overcharge?: number;
}

class FuncDescriptor extends React.Component<IProps> {
    getDataVal(): DataVal.DataVal {
        const func = this.props.func;

        if (this.props.level) {
            return getTargetVersionValues(func, this.props.level, this.props.overcharge ?? 1) ?? {};
        } else {
            const dataVals = getDataValList(func);

            return getStaticFieldValues(dataVals);
        }
    }

    getFollowerDataVal(): DataVal.DataVal | undefined {
        const func = this.props.func;

        if (!hasFollowerDataVals(func))
            return undefined;

        if (this.props.level) {
            return getTargetFollowerVersionValues(func, this.props.level) ?? {};
        } else {
            const dataVals = getFollowerDataValList(func);

            return getStaticFieldValues(dataVals);
        }
    }

    render() {
        const region = this.props.region,
            func = this.props.func,
            dataVal = this.getDataVal(),
            followerDataVal = this.getFollowerDataVal();

        const sections = new FuncDescriptorSections();

        handleTeamSection(region, sections, func, dataVal);
        handleChanceSection(region, sections, func, dataVal);
        handleActionSection(region, sections, func, dataVal);
        handleAmountSection(region, sections, func, dataVal);
        handleOnFieldSection(region, sections, func, dataVal);
        handleAffectsSection(region, sections, func, dataVal);
        if (followerDataVal) {
            handleAmountSection(region, sections, func, followerDataVal, true);
        }
        handleTargetSection(region, sections, func, dataVal);
        handleDurationSection(region, sections, func, dataVal);
        handleScalingSection(region, sections, func, dataVal);

        let parts: Renderable[] = [];

        Object.values(sections).forEach(section => {
            if (!section.showing)
                return;

            if (section.preposition)
                parts.push(section.preposition);

            parts = parts.concat(section.parts);
        });

        parts.push(
            <Link to={`/${region}/func/${func.funcId}`}>
                <FontAwesomeIcon icon={faShare}/>
            </Link>
        );

        parts = joinElements(parts, ' ');

        return (
            <span>
                {parts.map((element, index) => {
                    return <React.Fragment key={index}>{element}</React.Fragment>;
                })}
            </span>
        );
    }
}

export default FuncDescriptor;
