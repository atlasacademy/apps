import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Alert, ButtonGroup, Dropdown, Table } from "react-bootstrap";

import { Profile, ProfileVoiceType, Region, Entity, Servant, CraftEssence } from "@atlasacademy/api-connector";
import { toTitleCase } from "@atlasacademy/api-descriptor";

import Api from "../../Api";
import renderCollapsibleContent from "../../Component/CollapsibleContent";
import EntityDescriptor from "../../Descriptor/EntityDescriptor";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";
import VoiceActorDescriptor from "../../Descriptor/VoiceActorDescriptor";
import VoiceCondTypeDescriptor from "../../Descriptor/VoiceCondTypeDescriptor";
import mergeVoiceLine from "../../Descriptor/VoiceLineMerger";
import VoiceLinePlayer from "../../Descriptor/VoiceLinePlayer";
import VoicePlayCondDescriptor from "../../Descriptor/VoicePlayCondDescriptor";
import VoicePrefixDescriptor from "../../Descriptor/VoicePrefixDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";
import { VoiceSubtitleFormat } from "../../Helper/StringHelper";

import "../../Helper/StringHelper.css";

const voiceTextField = (region: Region, voiceType: ProfileVoiceType) => {
    return (
        (region === Region.JP && voiceType === ProfileVoiceType.FIRST_GET) ||
        region === Region.CN ||
        region === Region.TW
    );
};

export default function ServantVoiceLines(props: {
    region: Region;
    servants: Map<number, Servant.ServantBasic>;
    servant: Servant.Servant | CraftEssence.CraftEssence;
    servantName?: string;
}) {
    let [relatedVoiceSvts, setRelatedVoiceSvts] = useState<Entity.EntityBasic[]>(null as any);
    useEffect(() => {
        Api.searchEntityVoiceCondSvt([props.servant.collectionNo]).then((s) => setRelatedVoiceSvts(s));
    }, [props.servant]);

    let { profile, ascensionAdd } = props.servant;
    let voices = profile?.voices;
    let voicePrefixes = new Set([...(voices?.entries() || [])].map((entry) => entry[1].voicePrefix));
    let voicePrefixConditionPresent = voicePrefixes.size > 1;

    // sorting into prefixes
    let sortedVoice: [number, typeof voices][] = [...voicePrefixes].map((prefix) => [
        prefix,
        voices?.filter((voice) => voice.voicePrefix === prefix),
    ]);

    let out = sortedVoice.map(([prefix, voices]) => {
        let voiceLineTable = voices?.map((voice) => {
            let voiceLines = voice.voiceLines.sort((a, b) => (b.priority || 0) - (a.priority || 0));
            let voiceLineNames: string[] = [];
            let voiceNameCount: Record<string, number> = {};
            for (let line of voiceLines) {
                line.conds = line.conds.filter(
                    (cond) => !(cond.condType === Profile.VoiceCondType.EVENT_END && cond.value === 0)
                );
                let lineName = line.overwriteName || line.name || "";
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
                                <td style={{ verticalAlign: "middle" }}>
                                    <b className="newline">{voiceLineNames[index]}</b>
                                    <br />
                                    <div className="newline">
                                        {voiceTextField(props.region, voice.type) ? (
                                            line.text.map((line, i) => (
                                                <VoiceSubtitleFormat key={i} region={props.region} inputString={line} />
                                            ))
                                        ) : (
                                            <VoiceSubtitleFormat region={props.region} inputString={line.subtitle} />
                                        )}
                                    </div>
                                    {line.conds.length || line.playConds.length || line.summonScript ? (
                                        <>
                                            <Alert variant="info" style={{ marginBottom: 0, marginTop: "1em" }}>
                                                {line.summonScript === undefined ? null : (
                                                    <>
                                                        Summoning Script:{" "}
                                                        <ScriptDescriptor
                                                            region={props.region}
                                                            scriptId={line.summonScript.scriptId}
                                                            scriptType=""
                                                        />
                                                    </>
                                                )}
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
                                                    servants={props.servants}
                                                />
                                            </Alert>
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </td>
                                <td style={{ verticalAlign: "middle", width: "1px" }}>
                                    <ButtonGroup>
                                        <VoiceLinePlayer
                                            audioAssetUrls={line.audioAssets}
                                            delay={line.delay}
                                            title={voiceLineNames[index]}
                                        />
                                        <Dropdown as={ButtonGroup}>
                                            <Dropdown.Toggle
                                                variant={"info"}
                                                title={`Download ${voiceLineNames[index]}`}
                                            >
                                                <FontAwesomeIcon icon={faFileAudio} />
                                                &nbsp;
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu title={`Download ${voiceLineNames[index]}`}>
                                                <Dropdown.Item
                                                    title={`Download ${voiceLineNames[index]} merged file`}
                                                    onClick={() => {
                                                        const fileName = `${props.servant.collectionNo} - ${props.servant.name} - ${voiceLineNames[index]}`;
                                                        mergeVoiceLine(line.audioAssets, line.delay, fileName);
                                                    }}
                                                >
                                                    Merged
                                                </Dropdown.Item>
                                                {line.audioAssets.map((asset, i) => (
                                                    <Dropdown.Item
                                                        key={i}
                                                        href={asset}
                                                        target="_blank"
                                                        title={`Download ${voiceLineNames[index]} part ${i + 1}`}
                                                    >
                                                        Part {i + 1}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
            return (
                <tr key={`${voice.svtId}-${voice.type}-${voice.voicePrefix}`}>
                    <td>{voice.type === ProfileVoiceType.GROETH ? "Growth" : toTitleCase(voice.type)}</td>
                    <td>{lines}</td>
                </tr>
            );
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
        );
        if (voicePrefixConditionPresent) {
            const title = (
                <VoicePrefixDescriptor
                    currentVoicePrefix={prefix}
                    ascensionAdd={ascensionAdd}
                    costumes={profile?.costume}
                />
            );
            return (
                <div key={prefix}>
                    {renderCollapsibleContent({ title: title, content: outputTable, subheader: false })}
                </div>
            );
        } else return <div key={prefix}>{outputTable}</div>;
    });

    return (
        <>
            <Alert variant="success">
                <VoiceActorDescriptor region={props.region} cv={props.servant.profile?.cv} />
            </Alert>
            {props.servant.type !== Entity.EntityType.SERVANT_EQUIP && (
                <Alert variant="success">
                    {relatedVoiceSvts !== null
                        ? relatedVoiceSvts.length > 0
                            ? `Servants with voice lines about ${props.servantName ?? props.servant.name}: `
                            : `There is no voice line about ${
                                  props.servantName ?? props.servant.name
                              } from other servants.`
                        : "Fetching related voice line data ..."}
                    {relatedVoiceSvts !== null && relatedVoiceSvts.length > 0
                        ? mergeElements(
                              relatedVoiceSvts.map((svt) => (
                                  <EntityDescriptor key={svt.id} region={props.region} entity={svt} tab={"voices"} />
                              )),
                              ", "
                          )
                        : ""}
                </Alert>
            )}
            {out}
        </>
    );
}
