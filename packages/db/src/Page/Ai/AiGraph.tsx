import CytoscapeComponent from "react-cytoscapejs";

import { Ai } from "@atlasacademy/api-connector";

import useWindowDimensions from "../../Helper/WindowHelper";

function getCytoscapeElements(aiCol: Ai.AiCollection) {
    let pushedMains = new Set();
    let dataarray = [];
    for (const ai of aiCol.mainAis.concat(aiCol.relatedAis)) {
        if (!pushedMains.has(ai.id)) {
            dataarray.push({
                data: { id: ai.id.toString() },
                classes: "idNode",
            });
            pushedMains.add(ai.id);
        }
        dataarray.push({
            data: { id: `${ai.id}-${ai.idx}` },
            classes: "idxNode",
        });
        dataarray.push({
            data: {
                source: ai.id.toString(),
                target: `${ai.id}-${ai.idx}`,
            },
            classes: "idIdxEdge",
        });
        if (ai.avals[0] !== 0) {
            dataarray.push({
                data: {
                    source: `${ai.id}-${ai.idx}`,
                    target: ai.avals[0].toString(),
                },
                classes: "idxIdEdge",
            });
        }
    }
    return dataarray;
}

function getGraphSize(windowWidth: number, windowHeight: number) {
    let graphWidth = -1;
    let graphHeight = -1;
    // From CSS media query of Bootstrap Container
    let windowContainerWidths = [
        [1200, 1140],
        [992, 960],
        [768, 720],
        [576, 540],
    ];

    for (const [minWindowWdith, maxContainerWidth] of windowContainerWidths) {
        if (windowWidth >= minWindowWdith) {
            // Bootstrap Container padding-right: 15px; padding-left: 15px;
            graphWidth = Math.max(maxContainerWidth) - 30;
            break;
        }
    }
    if (graphWidth === -1) graphWidth = windowWidth - 30;

    if (windowWidth > windowHeight) {
        graphHeight = windowHeight * 0.6;
    } else {
        graphHeight = windowHeight * 0.45;
    }
    return { graphWidth, graphHeight };
}

export default function AiGraph(props: { aiCol: Ai.AiCollection; handleNavigateAiId?: (id: number) => void }) {
    const { windowWidth, windowHeight } = useWindowDimensions(),
        { graphWidth, graphHeight } = getGraphSize(windowWidth, windowHeight),
        elements = getCytoscapeElements(props.aiCol);

    return (
        <CytoscapeComponent
            elements={elements}
            style={{ width: `${graphWidth}px`, height: `${graphHeight}px` }}
            minZoom={0.1}
            maxZoom={3}
            wheelSensitivity={0.2}
            layout={{ name: "breadthfirst" }}
            stylesheet={[
                {
                    selector: "node",
                    style: {
                        "background-color": "white",
                        label: "data(id)",
                        "text-valign": "center",
                        "text-halign": "center",
                        width: 90,
                        height: 20,
                        shape: "round-rectangle",
                    },
                },
                {
                    selector: ".idNode",
                    style: {
                        "font-weight": "bold",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 4,
                        "line-color": "#ccc",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                    },
                },
                {
                    selector: ".idxIdEdge",
                    style: {
                        "line-style": "dashed",
                    },
                },
            ]}
            cy={(cytoscape) =>
                cytoscape.on("tap", "node", (cytoscapeEvent) =>
                    props.handleNavigateAiId?.(+cytoscapeEvent.target.id().split("-")[0])
                )
            }
        />
    );
}
