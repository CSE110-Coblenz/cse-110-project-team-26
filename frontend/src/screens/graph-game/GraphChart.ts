/*

Define constants to determine graph dimensions
Translate Konva's coordinate system into something actual useful
Draw the lines according to the dimensions
Translate input coordinates into Konva coordinates

*/

import Konva from "konva";
import type { View } from "../../types";
import { OFFSET, GRAPH_BACKGROUND_PROPERTIES, GRAPH_GROUP_PROPERTIES, PIX_PER_UNIT } from "./GraphScreenConstants";

let graphGroup: Konva.Group = new Konva.Group(GRAPH_GROUP_PROPERTIES);
let graphChart: Konva.Rect = new Konva.Rect(GRAPH_BACKGROUND_PROPERTIES);
let width: number = GRAPH_BACKGROUND_PROPERTIES.width;
let height: number = GRAPH_BACKGROUND_PROPERTIES.height;

let xRange: number = width / PIX_PER_UNIT;
let yRange: number = height / PIX_PER_UNIT;
let graphChartLeft = OFFSET;
let graphChartright = graphChart.width() + OFFSET;
let graphChartTop = OFFSET;
let graphChartBottom = graphChart.height() + OFFSET;
for (let i = 0; i < xRange; i++) {
    let line = new Konva.Line({
        points: [graphChartLeft + (i * PIX_PER_UNIT), graphChartTop,
            graphChartLeft + (i * PIX_PER_UNIT), graphChartBottom
        ],
        stroke: 'white',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    graphGroup.add(line);
}
for (let i = 0; i < yRange; i++) {
    let line = new Konva.Line({
        points: [graphChartLeft, graphChartTop + (i * PIX_PER_UNIT),
            graphChartright, graphChartTop + (i * PIX_PER_UNIT)
        ],
        stroke: 'white',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    graphGroup.add(line);
}

graphGroup.add(graphChart);
graphChart.setZIndex(0);
console.log(graphChart.getZIndex());

export {
    graphGroup
}