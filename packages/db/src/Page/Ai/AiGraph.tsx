import { Ai } from "@atlasacademy/api-connector";
import CytoscapeComponent from "react-cytoscapejs";

function getCytoscapeElements(aiCol: Ai.AiCollection) {
  let pushedMains = new Set();
  let dataarray = [];
  for (let ai of aiCol.mainAis.concat(aiCol.relatedAis)) {
    if (!pushedMains.has(ai.id)) {
      dataarray.push({ data: { id: ai.id.toString() }, classes: "idNode" });
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

export default function AiGraph(props: { aiCol: Ai.AiCollection }) {
  const elements = getCytoscapeElements(props.aiCol);

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "1100px", height: "600px" }}
      layout={{ name: "breadthfirst" }}
      stylesheet={[
        {
          selector: "node",
          style: {
            "background-color": "white",
            label: "data(id)",
            "text-valign": "center",
            "text-halign": "center",
            width: 70,
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
    />
  );
}
