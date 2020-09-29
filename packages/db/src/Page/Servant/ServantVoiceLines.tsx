import {ProfileVoiceType, Region, Servant} from "@atlasacademy/api-connector";
import {toTitleCase} from "@atlasacademy/api-descriptor";
import React, {useState} from "react";
import {ButtonGroup, Dropdown, DropdownButton, Table} from "react-bootstrap"
import VoiceLineAudioDescriptor from "../../Descriptor/VoiceLineAudioDescriptor";
import {handleNewLine} from "../../Helper/OutputHelper";

let formatSubtitle = (subtitle: string) => handleNewLine(subtitle.replace(/ *\[[^\]]*]/g, ' ').trim());

export default function (props: { region: Region; servant: Servant.Servant }) {
    let [playing, setPlaying] = useState('');
    let voices = props.servant?.profile?.voices;
    let out: JSX.Element[] = [];

    if (voices)
        for (let voice of voices) {
            let {voiceLines} = voice;
            let lines = (
                <Table bordered>
                    <tbody>
                    {voiceLines.map((line, index) => (
                        <tr key={`line_${index}`}>
                            <td>
                                <b>{line.overwriteName.replace("{0}", (index + 1).toString()) || line.name}</b>
                                <br/>
                                {formatSubtitle(
                                    (props.region === Region.JP && voice.type === ProfileVoiceType.FIRST_GET) ?
                                        line.text.join() : line.subtitle
                                )}
                            </td>
                            <td style={{verticalAlign: 'middle', width: '1px'}}>
                                <ButtonGroup>
                                    <VoiceLineAudioDescriptor
                                        playing={playing}
                                        audioAssetUrls={line.audioAssets}
                                        delay={line.delay}
                                        id={`${line.name}-${index}`}
                                        onPlayStateChange={setPlaying}/>
                                    <DropdownButton alignRight as={ButtonGroup} title="Downloads">
                                        {line.audioAssets.map(
                                            (asset, i) => (
                                                <Dropdown.Item href={asset}>
                                                    Part {i + 1}
                                                </Dropdown.Item>
                                            )
                                        )}
                                    </DropdownButton>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
            let row = (
                <tr>
                    <td>{(voice.type === ProfileVoiceType.GROETH) ? "Growth" : toTitleCase(voice.type)}</td>
                    <td>{lines}</td>
                </tr>
            )
            out.push(row);
        }

    return (
        <Table responsive>
            <thead>
            <tr>
                <td>Type</td>
                <td>Lines</td>
            </tr>
            </thead>
            <tbody>{out}</tbody>
        </Table>
    )
}
