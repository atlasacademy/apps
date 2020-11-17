import {Profile, ProfileVoiceType, Region, Servant} from "@atlasacademy/api-connector";
import {toTitleCase} from "@atlasacademy/api-descriptor";
import {faFileAudio} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, ButtonGroup, Dropdown, Table} from "react-bootstrap"
import VoiceLinePlayer from "../../Descriptor/VoiceLinePlayer";
import VoiceCondTypeDescriptor from "../../Descriptor/VoiceCondTypeDescriptor";
import {handleNewLine} from "../../Helper/OutputHelper";

let formatSubtitle = (subtitle: string) => handleNewLine(subtitle.replace(/ *\[[^\]]*]/g, ' ').trim());

export default function (props: { region: Region; servant: Servant.Servant }) {
    let voices = props.servant?.profile?.voices;
    let out: JSX.Element[] = [];

    if (voices)
        for (let [i, voice] of voices.entries()) {
            let {voiceLines} = voice;
            for (let line of voiceLines)
                line.conds = line.conds.filter(cond => !(cond.condType === Profile.VoiceCondType.EVENT_END && cond.value === 0));
            let lines = (
                <Table bordered>
                    <tbody>
                    {voiceLines.sort((a, b) => ((b.priority || 0) - (a.priority || 0))).map((line, index) => (
                        <tr key={`line_${index}`}>
                            <td style={{verticalAlign: 'middle'}}>
                                <b>{line.overwriteName.replace("{0}", (index + 1).toString()) || line.name}</b>
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
                                            {line.conds.map(cond => <><VoiceCondTypeDescriptor region={props.region} cond={cond} /><br /></>)}
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
            let row = (
                <tr key={i}>
                    <td>{(voice.type === ProfileVoiceType.GROETH) ? "Growth" : toTitleCase(voice.type)}</td>
                    <td>{lines}</td>
                </tr>
            )
            out.push(row);
        }

    return (
        <>
            <Alert variant="success">Voice Actor : {props.servant.profile?.cv}</Alert>
            <Table responsive>
                <thead>
                <tr>
                    <td>Type</td>
                    <td>Lines</td>
                </tr>
                </thead>
                <tbody>{out}</tbody>
            </Table>
        </>
    )
}
