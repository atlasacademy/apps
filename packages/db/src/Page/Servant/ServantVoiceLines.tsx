import {Profile, ProfileVoiceType, Region, Entity, Servant} from "@atlasacademy/api-connector";
import {toTitleCase} from "@atlasacademy/api-descriptor";
import {faFileAudio} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import Api from '../../Api';
import {Alert, ButtonGroup, Dropdown, Table} from "react-bootstrap"
import VoiceLinePlayer from "../../Descriptor/VoiceLinePlayer";
import VoiceCondTypeDescriptor from "../../Descriptor/VoiceCondTypeDescriptor";
import VoicePrefixDescriptor from "../../Descriptor/VoicePrefixDescriptor";
import entityDescriptor from "../../Descriptor/entityDescriptor";
import {handleNewLine, mergeElements} from "../../Helper/OutputHelper";
import renderCollapsibleContent from "../../Component/CollapsibleContent";

let formatSubtitle = (subtitle: string) => handleNewLine(subtitle.replace(/ *\[[^\]]*]/g, ' ').trim());

export default function ServantVoiceLines(
    props: {
        region: Region;
        servants: Servant.ServantBasic[];
        servant: Servant.Servant;
    }
){
    let [relatedVoiceSvts, setRelatedVoiceSvts] = useState<Entity.EntityBasic[]>(null as any);
    useEffect(() => {
        Api.searchEntity(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            props.servant.collectionNo
        ).then(s => setRelatedVoiceSvts(s));
    }, [props.servant])

    let { profile, ascensionAdd } = props.servant;
    let voices = profile?.voices;
    let voicePrefixes = new Set([...(voices?.entries() || [])].map(entry => entry[1].voicePrefix));
    let voicePrefixConditionPresent = voicePrefixes.size > 1;

    // sorting into prefixes
    let sortedVoice : [number, typeof voices][] =
        [...voicePrefixes].map(prefix => [prefix, voices?.filter(voice => voice.voicePrefix === prefix)]);

    let out = sortedVoice.map(([prefix, voices]) => {
        let voiceLineTable = voices?.map(voice => {
            let voiceLines = voice.voiceLines.sort((a, b) => ((b.priority || 0) - (a.priority || 0)));
            let voiceLineNames: string[] = [];
            let voiceNameCount: Record<string, number> = {};
            for (let line of voiceLines) {
                line.conds = line.conds.filter(cond => !(cond.condType === Profile.VoiceCondType.EVENT_END && cond.value === 0));
                let lineName = line.overwriteName || line.name || '';
                if (lineName in voiceNameCount) {
                    voiceNameCount[lineName]++;
                } else {
                    voiceNameCount[lineName] = 1;
                }
                voiceLineNames.push(lineName.replace("{0}", voiceNameCount[lineName].toString()));
            }

            let lines = (
                <Table bordered>
                    <tbody>
                    {voiceLines.map((line, index) => (
                        <tr key={`line_${index}`}>
                            <td style={{verticalAlign: 'middle'}}>
                                <b>{voiceLineNames[index]}</b>
                                <br/>
                                {formatSubtitle(
                                    (props.region === Region.JP && voice.type === ProfileVoiceType.FIRST_GET) ?
                                        line.text.join() : line.subtitle
                                )}
                                {line.conds.length ? (
                                    <>
                                        <br/>{line.text.join('') || line.subtitle ? <>&nbsp;</> : ''}
                                        <Alert variant="info" style={{marginBottom: 0}}>
                                            <b>Requirements:</b><br />
                                            {line.conds.map(cond => <>
                                                <VoiceCondTypeDescriptor
                                                    region={props.region}
                                                    servants={props.servants}
                                                    costumes={profile?.costume}
                                                    cond={cond}
                                                /><br /></>
                                            )}
                                        </Alert>
                                    </>
                                ) : ''}
                            </td>
                            <td style={{verticalAlign: 'middle', width: '1px'}}>
                                <ButtonGroup>
                                    <VoiceLinePlayer
                                        audioAssetUrls={line.audioAssets}
                                        delay={line.delay}/>
                                    <Dropdown as={ButtonGroup}>
                                        <Dropdown.Toggle variant={"info"}>
                                            <FontAwesomeIcon icon={faFileAudio}/>
                                            &nbsp;
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {line.audioAssets.map(
                                                (asset, i) => (
                                                    <Dropdown.Item key={i} href={asset} target="_blank">
                                                        Part {i + 1}
                                                    </Dropdown.Item>
                                                )
                                            )}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
            return (
                <tr>
                    <td>{(voice.type === ProfileVoiceType.GROETH) ? "Growth" : toTitleCase(voice.type)}</td>
                    <td>{lines}</td>
                </tr>
            )
        });
        let outputTable = (
            <Table responsive>
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Lines</td>
                    </tr>
                </thead>
                <tbody>{voiceLineTable}</tbody>
            </Table>
        )
        if (voicePrefixConditionPresent)
            return renderCollapsibleContent({
                title: <VoicePrefixDescriptor currentVoicePrefix={prefix} ascensionAdd={ascensionAdd} costumes={profile?.costume} />,
                content: outputTable,
                subheader: false
            });
        else
            return outputTable;
    })

    return (
        <>
            <Alert variant="success">Voice Actor: {props.servant.profile?.cv}</Alert>
            <Alert variant="success">
                {relatedVoiceSvts
                    ? relatedVoiceSvts.length > 0
                    ? `Servants with voice lines about ${props.servant.name}: `
                    : `There is no voice line about ${props.servant.name} from other servants.`
                    : 'Fetching related voice line data ...'}
                {(relatedVoiceSvts && relatedVoiceSvts.length > 0)
                    ? mergeElements(relatedVoiceSvts.map(svt => entityDescriptor(props.region, svt, undefined, 'voices')), ', ')
                    : ''}
            </Alert>
            {out}
        </>
    )
}
