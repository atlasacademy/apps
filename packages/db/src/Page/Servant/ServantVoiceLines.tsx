import React, { useState } from "react";
import {Table, Dropdown, DropdownButton, ButtonGroup} from "react-bootstrap"
import {Servant} from '@atlasacademy/api-connector';
import VoiceLineAudioDescriptor from "../../Descriptor/VoiceLineAudioDescriptor";

export default function (props : { servant: Servant.Servant }) {
    let [playing, setPlaying] = useState('');
    let voices = props.servant?.profile?.voices;
    let out : JSX.Element[] = [];

    if (voices)
    for (let voice of voices) {
        let { voiceLines } = voice;
        let lines = (
            <Table bordered>
                <tbody>
                    {voiceLines.map((line, index) => (
                        <tr key={`line_${index}`}>
                            <td>
                                <b>{line.name}</b>
                                <br />
                                {line.subtitle}
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>
                                <ButtonGroup>
                                    <VoiceLineAudioDescriptor
                                        playing={playing}
                                        audioAssetUrls={line.audioAssets}
                                        delay={line.delay}
                                        id={`${line.name}-${index}`}
                                        onPlayStateChange={setPlaying}/>
                                    <DropdownButton as={ButtonGroup} title="Downloads">
                                        {line.audioAssets.map(
                                            (asset, i) => (
                                                <Dropdown.Item as={'a'}>
                                                    <a href={asset} download>Part {i + 1}</a>
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
                <td>{voice.type}</td>
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
