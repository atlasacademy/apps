import {faShare} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import Func, {FuncTargetType, FuncType} from "../Api/Data/Func";
import Region from "../Api/Data/Region";
import {
    funcUpdatesByLevel,
    funcUpdatesByOvercharge, getLevelDataValList,
    getMixedDataValList,
    getOverchargeDataValList, getStaticFieldValues
} from "../Helper/FuncHelper";
import {joinElements, Renderable} from "../Helper/OutputHelper";
import BuffDescriptor from "./BuffDescriptor";
import BuffValueDescriptor from "./BuffValueDescriptor";
import FuncValueDescriptor from "./FuncValueDescriptor";
import TraitDescriptor from "./TraitDescriptor";

interface IProps {
    region: Region;
    func: Func;
}

class FuncDescriptor extends React.Component<IProps> {
    render() {
        const region = this.props.region,
            func = this.props.func,
            isLevel = funcUpdatesByLevel(func),
            isOvercharge = funcUpdatesByOvercharge(func),
            dataVals = isLevel && isOvercharge
                ? getMixedDataValList(func)
                : (isOvercharge ? getOverchargeDataValList(func) : getLevelDataValList(func)),
            staticValues = getStaticFieldValues(dataVals);

        const parts: Renderable[] = [],
            sectionFlags = {
                chance: true,
                action: true,
                amountPreposition: 'of',
                amount: true,
                affects: true,
                targetPreposition: 'to',
                target: true,
                duration: true,
                scaling: true,
            };

        if (sectionFlags.chance && staticValues.Rate && staticValues.Rate !== 1000) {
            parts.push((staticValues.Rate / 10) + '% Chance to');
        } else if (!staticValues.Rate && func.funcType !== FuncType.NONE) {
            parts.push('Chance to');
        }

        if (sectionFlags.action) {
            if (func.funcType === FuncType.ADD_STATE || func.funcType === FuncType.ADD_STATE_SHORT) {
                parts.push('Apply');
                func.buffs.forEach((buff, index) => {
                    if (index > 0)
                        parts.push('&');

                    parts.push(<BuffDescriptor region={region} buff={buff}/>);
                });
                sectionFlags.targetPreposition = 'on';
            } else if (func.funcType === FuncType.SUB_STATE) {
                parts.push('Remove effects');

                if (func.traitVals?.length) {
                    parts.push('with');

                    func.traitVals.forEach((trait, index) => {
                        if (index > 0)
                            parts.push('&');

                        parts.push(<TraitDescriptor region={region} trait={trait}/>);
                    });
                }
                sectionFlags.targetPreposition = 'for';
            } else if (func.funcType === FuncType.DAMAGE_NP) {
                parts.push('Deal damage');
                sectionFlags.amountPreposition = 'for';
            } else if (
                func.funcType === FuncType.DAMAGE_NP_INDIVIDUAL
                || func.funcType === FuncType.DAMAGE_NP_STATE_INDIVIDUAL_FIX
            ) {
                if (staticValues.Target) {
                    parts.push(
                        <span>Deal damage (additional to targets with {
                            <TraitDescriptor region={region} trait={staticValues.Target}/>
                        })</span>
                    );
                } else {
                    parts.push('Deal damage');
                }
                sectionFlags.amountPreposition = 'for';
            } else if (func.funcType === FuncType.DAMAGE_NP_PIERCE) {
                parts.push('Deal damage that pierces defence');
                sectionFlags.amountPreposition = 'for';
            } else if (func.funcType === FuncType.DELAY_NPTURN) {
                parts.push('Drain Charge');
                sectionFlags.targetPreposition = 'from';
            } else if (func.funcType === FuncType.GAIN_HP) {
                parts.push('Gain HP');
                sectionFlags.targetPreposition = 'on';
            } else if (func.funcType === FuncType.GAIN_NP) {
                parts.push('Charge NP');
                sectionFlags.targetPreposition = 'for';
            } else if (func.funcType === FuncType.GAIN_STAR) {
                parts.push('Gain Critical Stars');
                sectionFlags.target = false;
            } else if (func.funcType === FuncType.INSTANT_DEATH) {
                parts.push('Apply Death');
            } else if (func.funcType === FuncType.LOSS_HP_SAFE) {
                parts.push('Lose HP')
                sectionFlags.target = false;
            } else if (func.funcType === FuncType.NONE) {
                parts.push('No Effect');
                sectionFlags.target = false;
            }
        }

        if (sectionFlags.amount && staticValues.Value) {
            if (func.buffs[0]) {
                parts.push('of');
                parts.push(<BuffValueDescriptor region={region} buff={func.buffs[0]} dataVal={staticValues}/>);
            } else {
                // there are some properties that we don't want back as the description
                const prunedValues = {...staticValues};
                prunedValues.Rate = undefined;

                parts.push('of');

                parts.push(<FuncValueDescriptor region={region} func={func} dataVal={staticValues}/>);
            }
        }

        if (sectionFlags.affects && func.functvals.length) {
            parts.push('for all');
            func.functvals.forEach((trait, index) => {
                if (index > 0)
                    parts.push('&');

                parts.push(<TraitDescriptor region={region} trait={trait}/>);
            });
        }

        if (sectionFlags.target) {
            parts.push(sectionFlags.targetPreposition);
            if (func.funcTargetType === FuncTargetType.ENEMY) {
                parts.push('enemy');
            } else if (func.funcTargetType === FuncTargetType.ENEMY_ALL) {
                parts.push('all enemies');
            } else if (func.funcTargetType === FuncTargetType.PT_ALL) {
                parts.push('party');
            } else if (func.funcTargetType === FuncTargetType.PT_ONE) {
                parts.push('party member');
            } else if (func.funcTargetType === FuncTargetType.PT_OTHER) {
                parts.push('party except self');
            } else if (func.funcTargetType === FuncTargetType.SELF) {
                parts.push('self');
            }
        }

        if (sectionFlags.duration) {
            if (staticValues.Count && staticValues.Count > 0 && staticValues.Turn && staticValues.Turn > 0) {
                const countDesc = staticValues.Count === 1 ? '1 Time' : `${staticValues.Count} Times`,
                    turnDesc = staticValues.Turn === 1 ? '1 Turn' : `${staticValues.Turn} Turns`;

                parts.push(`(${turnDesc}, ${countDesc})`);
            } else if (staticValues.Turn && staticValues.Turn > 0) {
                parts.push(staticValues.Turn === 1 ? '(1 Turn)' : `(${staticValues.Turn} Turns)`);
            } else if (staticValues.Count && staticValues.Count > 0) {
                parts.push(staticValues.Count === 1 ? '(1 Time)' : `(${staticValues.Count} Times)`);
            }
        }

        if (sectionFlags.scaling) {
            if (isLevel) {
                parts.push('<LEVEL>');
            }

            if (isOvercharge) {
                parts.push('<OVERCHARGE>');
            }
        }

        return (
            <span>
                {joinElements(parts, ' ')
                    .map((element, index) => {
                        return <React.Fragment key={index}>{element}</React.Fragment>;
                    })}
                {' '}
                <Link to={`/${region}/func/${func.funcId}`}>
                    <FontAwesomeIcon icon={faShare}/>
                </Link>
            </span>
        );
    }
}

export default FuncDescriptor;
