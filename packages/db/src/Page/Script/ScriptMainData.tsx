import { Button, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region, Script } from "@atlasacademy/api-connector";

import { flatten } from "../../Helper/PolyFill";
import useNavigationScripts from "../../Hooks/useNavigationScripts";
import { questListComponent } from "./ScriptMainData.components";

import "../../Component/DataTable.css";
import "./ScriptMainData.css";

const ScriptMainData = ({
    region,
    scriptData,
    wordCount,
    children,
}: {
    region: Region;
    scriptData: Script.Script;
    wordCount: number;
    children?: React.ReactNode;
}) => {
    const { scriptId } = scriptData;

    const { firstScriptInWar, lastScriptInWar, nextScript, previousScript } = useNavigationScripts({
        scriptData,
        scriptId,
    });

    const scriptIdPhase = scriptId.slice(scriptId.length - 1, scriptId.length),
        scriptIdPhaseNum = /[0-9]/.test(scriptIdPhase) ? parseInt(scriptIdPhase) : undefined;

    const scriptPhase =
        flatten(scriptData.quests.map((quest) => quest.phaseScripts)).find((phaseScript) =>
            phaseScript.scripts.map((script) => script.scriptId).includes(scriptId)
        )?.phase ?? scriptIdPhaseNum;

    const questList =
        scriptData.quests.length === 0
            ? null
            : questListComponent({
                  region,
                  scriptData,
                  scriptPhase,
                  scriptId,
                  previousScript,
                  nextScript,
                  firstScriptInWar,
                  lastScriptInWar,
              });

    let WORDS_PER_MINUTE = 200;
    // https://irisreading.com/average-reading-speed-in-various-languages/
    switch (region) {
        case Region.NA:
            WORDS_PER_MINUTE = 228;
            break;
        case Region.JP:
        case Region.KR:
            WORDS_PER_MINUTE = 357;
            break;
        case Region.CN:
        case Region.TW:
            WORDS_PER_MINUTE = 255;
            break;
    }

    return (
        <>
            <Table bordered hover responsive className="data-table script-data">
                <tbody>
                    <tr>
                        <th>Raw Size</th>
                        <td>{`${(scriptData.scriptSizeBytes / 1024).toFixed(2)} KiB`}</td>
                        <td colSpan={2}>~{Math.ceil(wordCount / WORDS_PER_MINUTE)} minute read</td>
                    </tr>
                    {questList}
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
                                to={`/${region}/script/${previousScript}`}
                            >
                                Previous Script: {previousScript}
                            </Button>
                        )}
                    </Col>
                    <Col xs={12} sm="auto" className="ml-auto">
                        {nextScript === undefined ? null : (
                            <Button className="w-100" variant="light" as={Link} to={`/${region}/script/${nextScript}`}>
                                Next Script: {nextScript}
                            </Button>
                        )}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ScriptMainData;
