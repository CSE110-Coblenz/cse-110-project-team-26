/*

Define constants to determine graph dimensions
Translate Konva's coordinate system into something actual useful
Draw the lines according to the dimensions
Translate input coordinates into Konva coordinates

*/

import Konva from "konva";
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

/**
 * TO DO:
 * Add more flexibility in where the origin can be
 * Charting lines (thinking just drawing like 100 tiny lines for stuff like parabolas)
 * Place Obstacles !!!!!!!!!!!!!!!!
 */

let xMin = -6;
let yMax = 6;

let currX = xMin;
for (let i = 1; i < xRange; i++) {
    let position = graphChartLeft + (i * PIX_PER_UNIT)
    let line = new Konva.Line({
        points: [position, graphChartTop,
            position, graphChartBottom
        ],
        stroke: 'white',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    if (i == Math.floor(xRange / 2)) {
        line.strokeWidth(3);
    }

    let coordinateLabel = new Konva.Text({
        y: graphGroup.height() / 2,
        x: position,
        text: currX.toString(),
        fill: 'white',
        fontSize: 18
    })
    currX++;

    graphGroup.add(line);
    graphGroup.add(coordinateLabel)
}
let currY = yMax;
for (let i = 1; i < yRange; i++) {
    let position = graphChartTop + (i * PIX_PER_UNIT);
    let line = new Konva.Line({
        points: [graphChartLeft, position,
            graphChartright, position
        ],
        stroke: 'white',
        strokeWidth: 1,
        lineCap: 'round',
        lineJoin: 'round'
    });
    if (i == Math.floor(yRange / 2)) {
        line.strokeWidth(3);
    }

    let coordinateLabel = new Konva.Text({
        y: position,
        x: graphGroup.width() / 2 - PIX_PER_UNIT,
        text: currY.toString(),
        fill: 'white',
        fontSize: 18
    })
    currY--;

    graphGroup.add(line);
    if (currY == -1) continue;
    graphGroup.add(coordinateLabel)
}

graphGroup.add(graphChart);
graphChart.setZIndex(0);
console.log(graphChart.getZIndex());

function convertCoordToKonva(coord: number, isX: boolean): number {
    if (isX) {
        return OFFSET + (coord - xMin + 1) * PIX_PER_UNIT;
    }
    return OFFSET + (yMax - coord + 1) * PIX_PER_UNIT;
}

export {
    graphGroup,
    convertCoordToKonva
}
