import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Alert, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
import { lang } from "../../Setting/Manager";

import "../../Helper/StringHelper.css";

const voiceTextField = (region: Region, voiceType: ProfileVoiceType) => {
    return (
        (region === Region.JP && voiceType === ProfileVoiceType.FIRST_GET) ||
        region === Region.CN ||
        region === Region.TW
    );
};

export const VoiceLinesTable = ({
    region,
    voice,
    mergedDownloadNamePrefix,
    servants,
    costumes,
}: {
    region: Region;
    voice: Profile.VoiceGroup;
    mergedDownloadNamePrefix: string;
    servants: Map<number, Servant.ServantBasic>;
    costumes?: {
        [key: string]: Profile.CostumeDetail;
    };
}) => {
    const { t } = useTranslation();
    const voiceLines = voice.voiceLines.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const voiceLineNames: string[] = [];
    const voiceNameCount: Record<string, number> = {};
    for (const line of voiceLines) {
        let lineName = line.overwriteName || line.name || "";
        if (lineName in voiceNameCount) {
            voiceNameCount[lineName]++;
        } else {
            voiceNameCount[lineName] = 1;
        }
        voiceLineNames.push(lineName.replace("{0}", voiceNameCount[lineName].toString()));
    }

    return (
        <Table bordered className="mb-0">
            <tbody>
                {voiceLines.map((line, index) => {
                    const lineConds = line.conds.filter(
                        (cond) => !(cond.condType === Profile.VoiceCondType.EVENT_END && cond.value === 0)
                    );
                    return (
                        <tr key={`line_${index}`}>
                            <td style={{ verticalAlign: "middle" }}>
                                <b className="newline" lang={lang(region)}>
                                    {voiceLineNames[index]}
                                </b>
                                <br />
                                <div className="newline" lang={lang(region)}>
                                    {voiceTextField(region, voice.type) ? (
                                        line.text.map((line, i) => (
                                            <VoiceSubtitleFormat key={i} region={region} inputString={line} />
                                        ))
                                    ) : (
                                        <VoiceSubtitleFormat region={region} inputString={line.subtitle} />
                                    )}
                                </div>
                                {lineConds.length > 0 ||
                                line.playConds.length > 0 ||
                                line.summonScript !== undefined ? (
                                    <Alert variant="info" style={{ marginBottom: 0, marginTop: "1em" }}>
                                        {line.summonScript === undefined ? null : (
                                            <>
                                                Summoning Script:{" "}
                                                <ScriptDescriptor
                                                    region={region}
                                                    scriptId={line.summonScript.scriptId}
                                                    scriptType=""
                                                />
                                            </>
                                        )}
                                        {lineConds.length > 1 && (
                                            <>
                                                <b>Unlock Requirements (all of the following):</b>
                                                <br />
                                                <ul style={{ marginBottom: 0 }}>
                                                    {lineConds.map((cond, index) => (
                                                        <li key={index}>
                                                            <VoiceCondTypeDescriptor
                                                                region={region}
                                                                servants={servants}
                                                                costumes={costumes}
                                                                cond={cond}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
                                        {lineConds.length === 1 && (
                                            <>
                                                <b>Unlock Requirement:</b>
                                                <br />
                                                <VoiceCondTypeDescriptor
                                                    region={region}
                                                    servants={servants}
                                                    costumes={costumes}
                                                    cond={lineConds[0]}
                                                />
                                                <br />
                                            </>
                                        )}
                                        <VoicePlayCondDescriptor
                                            region={region}
                                            playConds={line.playConds}
                                            servants={servants}
                                        />
                                    </Alert>
                                ) : null}
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
                                            title={`${t("Download")} ${voiceLineNames[index]}`}
                                        >
                                            <FontAwesomeIcon icon={faFileAudio} />
                                            &nbsp;
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu title={`${t("Download")} ${voiceLineNames[index]}`}>
                                            <Dropdown.Item
                                                title={`${t("Download")} ${voiceLineNames[index]} merged file`}
                                                onClick={() => {
                                                    const fileName = `${mergedDownloadNamePrefix} - ${voiceLineNames[index]}`;
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
                                                    title={`${t("Download")} ${voiceLineNames[index]} part ${i + 1}`}
                                                >
                                                    Part {i + 1}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </ButtonGroup>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default function ServantVoiceLines(props: {
    region: Region;
    servants: Map<number, Servant.ServantBasic>;
    servant: Servant.Servant | CraftEssence.CraftEssence;
    servantName?: string;
}) {
    const { t } = useTranslation();
    const [relatedVoiceSvts, setRelatedVoiceSvts] = useState<Entity.EntityBasic[] | null>(null);
    useEffect(() => {
        Api.searchEntityVoiceCondSvt([props.servant.collectionNo]).then((s) => setRelatedVoiceSvts(s));
    }, [props.servant]);

    const { profile, ascensionAdd } = props.servant;
    const voices = profile?.voices;
    const voicePrefixes = new Set([...(voices?.entries() || [])].map((entry) => entry[1].voicePrefix));
    const voicePrefixConditionPresent = voicePrefixes.size > 1;

    // sorting into prefixes
    const sortedVoice: [number, Profile.VoiceGroup[] | undefined][] = [...voicePrefixes].map((prefix) => [
        prefix,
        voices?.filter((voice) => voice.voicePrefix === prefix),
    ]);

    const voiceGroupTable = sortedVoice.map(([prefix, voices]) => {
        const outputTable = (
            <Table responsive>
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Lines</td>
                    </tr>
                </thead>
                <tbody>
                    {voices?.map((voice) => (
                        <tr key={`${voice.svtId}-${voice.type}-${voice.voicePrefix}`}>
                            <td>{voice.type === ProfileVoiceType.GROETH ? "Growth" : toTitleCase(voice.type)}</td>
                            <td>
                                <VoiceLinesTable
                                    region={props.region}
                                    voice={voice}
                                    mergedDownloadNamePrefix={`${props.servant.collectionNo} - ${props.servant.name}`}
                                    servants={props.servants}
                                    costumes={props.servant.profile?.costume}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
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
                <React.Fragment key={prefix}>
                    {renderCollapsibleContent({ title: title, content: outputTable, subheader: false })}
                </React.Fragment>
            );
        } else {
            return <React.Fragment key={prefix}>{outputTable}</React.Fragment>;
        }
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
                            ? `${t("RelatedVoiceSvtsBefore")} ${props.servantName ?? props.servant.name}${t(
                                  "RelatedVoiceSvtsAfter"
                              )}: `
                            : `${t("RelatedVoiceSvtsNoneBefore")} ${props.servantName ?? props.servant.name}${t(
                                  "RelatedVoiceSvtsNoneAfter"
                              )}`
                        : t("RelatedVoiceSvtsFetching")}
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
            {voiceGroupTable}
        </>
    );
}
