import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

// SCREEN SPECIFIC CONSTANTS

const OFFSET = STAGE_WIDTH * 0.02;
const SIDEBAR_WIDTH = STAGE_WIDTH * (1/5);
const BOX_WIDTH = STAGE_WIDTH * (1/5) - OFFSET;
const SMALL_BOX_HEIGHT = STAGE_HEIGHT * (2/7);
const LARGE_BOX_HEIGHT = STAGE_HEIGHT * (3/7);
const GRAPH_WIDTH = STAGE_WIDTH * (4/5);

// Background, stays in the root group

const BACKGROUND_PROPERTIES = {
  x: 0,
  y: 0,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  fill: "#8B8B8B"
};

// Static group

const STATIC_GROUP_PROPERTIES = {
  x: 0,
  y: 0,
  width: SIDEBAR_WIDTH,
  height: STAGE_HEIGHT
};

// Graph group and elements

const GRAPH_GROUP_PROPERTIES = {
  x: SIDEBAR_WIDTH,
  y: 0,
  width: GRAPH_WIDTH,
  height: STAGE_HEIGHT
};

const GRAPH_BACKGROUND_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: Math.floor((GRAPH_GROUP_PROPERTIES.width - (OFFSET * 2)) / 100) * 100,
  height: Math.floor((GRAPH_GROUP_PROPERTIES.height - (OFFSET * 2)) / 20) * 20,
  fill: "#161313"
};

const PIX_PER_UNIT = 20;

// Sprite group and elements

const SPRITE_GROUP_PROPERTIES = {
  x: 0,
  y: 0,
  width: SIDEBAR_WIDTH,
  height: STAGE_HEIGHT * (2/7)
};

const SPRITE_BOX_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: BOX_WIDTH,
  height: SPRITE_GROUP_PROPERTIES.height - (OFFSET * 2),
  fill: "#FFF3F3"
};

// Dialogue group and elements

const DIALOGUE_GROUP_PROPERTIES = {
  x: 0,
  y: SPRITE_GROUP_PROPERTIES.height,
  width: SIDEBAR_WIDTH,
  height: STAGE_HEIGHT * (3/7)
};

const DIALOGUE_BOX_PROPERTIES = {
  x: OFFSET,
  y: 0,
  width: BOX_WIDTH,
  height: DIALOGUE_GROUP_PROPERTIES.height - OFFSET,
  fill: "#413434"
};

const DIALOGUE_TEXT_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x + (OFFSET * 0.5),
  y: DIALOGUE_BOX_PROPERTIES.y + (OFFSET * 0.5),
  width: DIALOGUE_BOX_PROPERTIES.width - OFFSET,
  height: DIALOGUE_BOX_PROPERTIES.height - OFFSET,
  text: "<Dialogue>\nOh no, an asteroid field! Let's safely plot a path to <destination>",
  fontSize: 24,
  fontFamily: "Arial",
  fill: "white"
};

// Equation/Input group and elements

const INPUT_AND_EQUATION_GROUP_PROPERTIES = {
  x: 0,
  y: DIALOGUE_GROUP_PROPERTIES.height + SPRITE_GROUP_PROPERTIES.height,
  width: SIDEBAR_WIDTH,
  height: STAGE_HEIGHT * (2/7)
};

const INPUT_AND_EQUATION_BOX_PROPERTIES = {
  x: OFFSET,
  y: 0,
  width: BOX_WIDTH,
  height: INPUT_AND_EQUATION_GROUP_PROPERTIES.height - OFFSET,
  fill: "#D9D9D9"
};

const EQUATION_BOX_PROPERTIES = {
  x: INPUT_AND_EQUATION_BOX_PROPERTIES.x + (OFFSET * (0.5)),
  y: INPUT_AND_EQUATION_BOX_PROPERTIES.y + (OFFSET * (0.5)),
  width: BOX_WIDTH - (OFFSET),
  height: (INPUT_AND_EQUATION_BOX_PROPERTIES.height * (1/4)) - OFFSET,
  fill: "#110808"
};

const EQUATION_TEXT_PROPERTIES = {
  x: EQUATION_BOX_PROPERTIES.x,
  y: EQUATION_BOX_PROPERTIES.y,
  width: EQUATION_BOX_PROPERTIES.width,
  height: EQUATION_BOX_PROPERTIES.height,
  text: "y=_x+_",
  fontSize: 16,
  fontFamily: "Arial",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

export {
  OFFSET,
  SIDEBAR_WIDTH,
  BOX_WIDTH,
  SMALL_BOX_HEIGHT,
  LARGE_BOX_HEIGHT,
  GRAPH_WIDTH,
  BACKGROUND_PROPERTIES,
  STATIC_GROUP_PROPERTIES,
  GRAPH_GROUP_PROPERTIES,
  GRAPH_BACKGROUND_PROPERTIES,
  SPRITE_GROUP_PROPERTIES,
  SPRITE_BOX_PROPERTIES,
  DIALOGUE_GROUP_PROPERTIES,
  DIALOGUE_BOX_PROPERTIES,
  DIALOGUE_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES,
  PIX_PER_UNIT
};
