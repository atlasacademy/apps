import {Profile, ProfileVoiceType, Region, Entity, Servant} from "@atlasacademy/api-connector";
import {toTitleCase} from "@atlasacademy/api-descriptor";
import {faFileAudio} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Api from '../../Api';
import {Alert, ButtonGroup, Dropdown, Table} from "react-bootstrap"
import VoiceLinePlayer from "../../Descriptor/VoiceLinePlayer";
import VoiceCondTypeDescriptor from "../../Descriptor/VoiceCondTypeDescriptor";
import VoicePlayCondDescriptor from "../../Descriptor/VoicePlayCondDescriptor";
import VoicePrefixDescriptor from "../../Descriptor/VoicePrefixDescriptor";
import EntityDescriptor from "../../Descriptor/EntityDescriptor";
import {handleNewLine, mergeElements} from "../../Helper/OutputHelper";
import renderCollapsibleContent from "../../Component/CollapsibleContent";
import mergeVoiceLine from "../../Descriptor/VoiceLineMerger";

let formatSubtitle = (subtitle: string) => handleNewLine(subtitle.replace(/ *\[[^\]]*]/g, ' ').trim());

export default function ServantVoiceLines(
    props: {
        region: Region;
        servants: Map<number, Servant.ServantBasic>;
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
            [props.servant.collectionNo]
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
                                {line.conds.length || line.playConds.length ? (
                                    <>
                                        <br/>{line.text.join('') || line.subtitle ? <>&nbsp;</> : ''}
                                        <Alert variant="info" style={{marginBottom: 0}}>
                                            {line.conds.length > 1 && (
                                                <>
                                                    <b>Unlock Requirements (all of the following):</b>
                                                    <br />
                                                    <ul style={{ marginBottom: 0 }}>
                                                        {line.conds.map((cond, index) => (
                                                            <li key={index}>
                                                                <VoiceCondTypeDescriptor
                                                                    region={props.region}
                                                                    servants={props.servants}
                                                                    costumes={profile?.costume}
                                                                    cond={cond}
                                                                />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {line.conds.length === 1 && (
                                                <>
                                                    <b>Unlock Requirement:</b>
                                                    <br />
                                                    <VoiceCondTypeDescriptor
                                                        region={props.region}
                                                        servants={props.servants}
                                                        costumes={profile?.costume}
                                                        cond={line.conds[0]}
                                                    />
                                                    <br />
                                                </>
                                            )}
                                            <VoicePlayCondDescriptor
                                                region={props.region}
                                                playConds={line.playConds}
                                                servants={props.servants}/>
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
                                            <Dropdown.Item onClick={() => {
                                                const fileName = `${props.servant.collectionNo} - ${props.servant.name} - ${voiceLineNames[index]}`;
                                                mergeVoiceLine(line.audioAssets, line.delay, fileName);
                                            }}>
                                                Merged
                                            </Dropdown.Item>
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
                <tr key={`${voice.svtId}-${voice.type}-${voice.voicePrefix}`}>
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
        if (voicePrefixConditionPresent){
            const title = <VoicePrefixDescriptor currentVoicePrefix={prefix} ascensionAdd={ascensionAdd} costumes={profile?.costume} />
            return <div key={prefix}>{renderCollapsibleContent({title: title, content: outputTable, subheader: false })}</div>;
        } else
            return <div key={prefix}>{outputTable}</div>;
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
                    ? mergeElements(relatedVoiceSvts.map(
                        svt => <EntityDescriptor key={svt.id} region={props.region} entity={svt} tab={"voices"} />
                    ), ', ')
                    : ''}
            </Alert>
            {out}
        </>
    )
}
