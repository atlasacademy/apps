import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import Func from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {getDataValList, getStaticFieldValues} from "../Helper/FuncHelper";
import {joinElements, Renderable} from "../Helper/OutputHelper";
import {FuncDescriptorSections} from "./Func/FuncDescriptorSections";
import handleActionSection from "./Func/handleActionSection";
import handleAffectsSection from "./Func/handleAffectsSection";
import handleAmountSection from "./Func/handleAmountSection";
import handleChanceSection from "./Func/handleChanceSection";
import handleDurationSection from "./Func/handleDurationSection";
import handleScalingSection from "./Func/handleScalingSection";
import handleTargetSection from "./Func/handleTargetSection";

interface IProps {
    region: Region;
    func: Func;
}

class FuncDescriptor extends React.Component<IProps> {
    render() {
        const region = this.props.region,
            func = this.props.func,
            dataVals = getDataValList(func),
            staticValues = getStaticFieldValues(dataVals);

        const sections = new FuncDescriptorSections();

        handleChanceSection(region, sections, func, staticValues);
        handleActionSection(region, sections, func, staticValues);
        handleAmountSection(region, sections, func, staticValues);
        handleAffectsSection(region, sections, func, staticValues);
        handleTargetSection(region, sections, func, staticValues);
        handleDurationSection(region, sections, func, staticValues);
        handleScalingSection(region, sections, func, staticValues);

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
