import { Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Region, Script } from "@atlasacademy/api-connector";

import { CompareRegion, ScriptSource } from "../../Component/Script";
import { getScriptQueryString } from "../../Descriptor/ScriptDescriptor";
import { toFixedLocale } from "../../Helper/NumberHelper";
import useNavigationScripts from "../../Hooks/useNavigationScripts";
import { QuestListComponent } from "./ScriptMainData.components";

import "../../Component/DataTable.css";
import "./ScriptMainData.css";

const ScriptMainData = ({
    region,
    scriptData,
    wordCount,
    children,
    scriptSource,
    goToScriptVersion,
    compareSource,
}: {
    region: Region;
    scriptData: Script.Script;
    wordCount: number;
    children?: React.ReactNode;
    scriptSource?: ScriptSource;
    goToScriptVersion?: ScriptSource;
    compareSource?: CompareRegion;
}) => {
    const { scriptId } = scriptData,
        { t } = useTranslation();

    const { firstScriptInWar, lastScriptInWar, nextScript, previousScript } = useNavigationScripts({
        scriptData,
        scriptId,
    });

    const scriptIdPhase = scriptId.slice(scriptId.length - 1, scriptId.length),
        scriptIdPhaseNum = /[0-9]/.test(scriptIdPhase) ? parseInt(scriptIdPhase) : undefined;

    const scriptPhase =
        scriptData.quests
            .map((quest) => quest.phaseScripts)
            .flat()
            .find((phaseScript) => phaseScript.scripts.map((script) => script.scriptId).includes(scriptId))?.phase ??
        scriptIdPhaseNum;

    const questList =
        scriptData.quests.length === 0 ? null : (
            <QuestListComponent
                region={region}
                scriptData={scriptData}
                scriptPhase={scriptPhase}
                scriptId={scriptId}
                previousScript={previousScript}
                nextScript={nextScript}
                firstScriptInWar={firstScriptInWar}
                lastScriptInWar={lastScriptInWar}
                scriptSource={scriptSource}
                compareSource={compareSource}
            />
        );

    let WORDS_PER_MINUTE = 200;
    switch (region) {
        case Region.NA:
            WORDS_PER_MINUTE = 300;
            break;
        case Region.JP:
            WORDS_PER_MINUTE = 600;
            break;
        case Region.KR:
            WORDS_PER_MINUTE = 600;
            break;
        case Region.CN:
            WORDS_PER_MINUTE = 450;
            break;
        case Region.TW:
            WORDS_PER_MINUTE = 450;
            break;
    }

    let goToScriptVersionLink = undefined,
        goToScriptVersionDesc = undefined;
    switch (goToScriptVersion) {
        case "original":
            goToScriptVersionLink = `/${region}/script/${scriptId}`;
            goToScriptVersionDesc = t("Original");
            break;
        case "rayshift":
            goToScriptVersionLink = `/${region}/script/${scriptId}?scriptSource=${goToScriptVersion}`;
            goToScriptVersionDesc = t("Rayshift (Unofficial translation)");
            break;
    }

    const scriptQueryString = getScriptQueryString(scriptSource, compareSource);

    return (
        <>
            <Table bordered hover responsive className="data-table script-data">
                <tbody>
                    <tr>
                        <th>{t("Raw Size")}</th>
                        <td>{`${toFixedLocale(scriptData.scriptSizeBytes / 1024, 2)} KiB`}</td>
                        <td className="w-50" colSpan={2}>
                            ~{Math.ceil(wordCount / WORDS_PER_MINUTE)} {t("minute read")}
                        </td>
                    </tr>
                    {questList}
                    {goToScriptVersionLink && (
                        <tr>
                            <th>{t("Other version")}</th>
                            <td colSpan={3}>
                                <Link to={goToScriptVersionLink}>{goToScriptVersionDesc}</Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {children}
            {children === undefined ? null : (
                <Row className="mt-3">
                    <Col xs={12} sm="auto">
                        {previousScript === undefined ? null : (
                            <Button
                                className="w-100 mb-2"
                                variant="light"
                                as={Link}
                                to={`/${region}/script/${previousScript}${scriptQueryString}`}
                            >
                                {t("Previous Script")}: {previousScript}
                            </Button>
                        )}
                    </Col>
                    <Col xs={12} sm="auto" className="ml-auto">
                        {nextScript === undefined ? null : (
                            <Button
                                className="w-100"
                                variant="light"
                                as={Link}
                                to={`/${region}/script/${nextScript}${scriptQueryString}`}
                            >
                                {t("Next Script")}: {nextScript}
                            </Button>
                        )}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ScriptMainData;
