import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { Alert, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { CraftEssence, Entity, Profile, ProfileVoiceType, Region, Servant } from "@atlasacademy/api-connector";

import renderCollapsibleContent from "../../Component/CollapsibleContent";
import EntityDescriptor from "../../Descriptor/EntityDescriptor";
import { ProfileVoiceTypeDescriptor } from "../../Descriptor/ProfileVoiceTypeDescriptor";
import ScriptDescriptor from "../../Descriptor/ScriptDescriptor";
import VoiceActorDescriptor from "../../Descriptor/VoiceActorDescriptor";
import VoiceCondTypeDescriptor from "../../Descriptor/VoiceCondTypeDescriptor";
import mergeVoiceLine from "../../Descriptor/VoiceLineMerger";
import VoiceLinePlayer from "../../Descriptor/VoiceLinePlayer";
import VoicePlayCondDescriptor from "../../Descriptor/VoicePlayCondDescriptor";
import VoicePrefixDescriptor from "../../Descriptor/VoicePrefixDescriptor";
import { mergeElements } from "../../Helper/OutputHelper";
import { VoiceSubtitleFormat } from "../../Helper/StringHelper";
import useApi from "../../Hooks/useApi";
import { lang } from "../../Setting/Manager";

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
                            <td className="align-middle">
                                <b className="text-prewrap" lang={lang(region)}>
                                    {voiceLineNames[index]}
                                </b>
                                <br />
                                <div className="text-prewrap" lang={lang(region)}>
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
                                    <Alert variant="info" className="mb-0 mt-3">
                                        {line.summonScript === undefined ? null : (
                                            <>
                                                {t("Summoning Script")}:{" "}
                                                <ScriptDescriptor
                                                    region={region}
                                                    scriptId={line.summonScript.scriptId}
                                                    scriptType=""
                                                />
                                            </>
                                        )}
                                        {lineConds.length > 1 && (
                                            <>
                                                <b>
                                                    {t("Unlock Requirement")}
                                                    {t("SforPlural")} ({t("All of the Following")}):
                                                </b>
                                                <br />
                                                <ul className="mb-0">
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
                                                <b>{t("Unlock Requirement")}:</b>
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
                            <td className="w-1px align-middle">
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
                                                title={`${t("Download")} ${voiceLineNames[index]} ${t("Merged File")}`}
                                                onClick={() => {
                                                    const fileName = `${mergedDownloadNamePrefix} - ${voiceLineNames[index]}`;
                                                    mergeVoiceLine(line.audioAssets, line.delay, fileName);
                                                }}
                                            >
                                                {t("Merged")}
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
    const colNo = useRef([props.servant.collectionNo]);
    const { data: relatedVoiceSvts } = useApi("searchEntityVoiceCondSvt", colNo.current);

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
                        <td>{t("Type")}</td>
                        <td>{t("Lines")}</td>
                    </tr>
                </thead>
                <tbody>
                    {voices?.map((voice) => (
                        <tr key={`${voice.svtId}-${voice.type}-${voice.voicePrefix}`}>
                            <td>
                                <ProfileVoiceTypeDescriptor voiceType={voice.type} />
                            </td>
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
                    {renderCollapsibleContent({ title, content: outputTable, subheader: false })}
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
                    {relatedVoiceSvts !== undefined ? (
                        relatedVoiceSvts.length > 0 ? (
                            <>
                                {t("RelatedVoiceSvtsBefore")}{" "}
                                <span lang={lang(props.region)}>{props.servantName ?? props.servant.name}</span>
                                {t("RelatedVoiceSvtsAfter")}:{" "}
                            </>
                        ) : (
                            <>
                                {t("RelatedVoiceSvtsNoneBefore")}{" "}
                                <span lang={lang(props.region)}>{props.servantName ?? props.servant.name}</span>
                                {t("RelatedVoiceSvtsNoneAfter")}
                            </>
                        )
                    ) : (
                        t("RelatedVoiceSvtsFetching")
                    )}
                    {relatedVoiceSvts !== undefined && relatedVoiceSvts.length > 0
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
