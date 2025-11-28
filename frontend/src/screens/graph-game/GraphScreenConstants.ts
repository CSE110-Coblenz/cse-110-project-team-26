import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

// Dialogue components

const DIALOGUE = {
  level1: "<Dialogue>\nWelcome space traveler! The first step in our journey involves flying to the planet Kepler-7b. Plot a path for the spaceship around the obstacles!",
  level2: "<Dialogue>\nNext stop is the planet KS-157d. There's some space debris in your way, make sure to avoid it!",
  level3: "<Dialogue>\nYou've been flying for a while traveler. Make your way to Hailey's comet for some rest.",
  level4: "<Dialogue>\nWe're in the home stretch now. Avoid the obstacles and plot your way to Pluto!",
  level5: "<Dialogue>\nYou can see the finish line! Avoid the asteroid belt and make your way to Earth!",
  success: "<Dialogue>\nYou made it! Time to search for resources.",
  failure: "<Dialogue>\nOops! You ran into an obstacle and your spaceship has sustained damage. Click the button to fix your engine!",
  incomplete: "Make sure that you've filled every parameter of the equation!",
  gameOver: "<Dialogue>\nWelcome home space traveler! You've gone quite a journey to get back to Earth. Congratulations on using your knowledge of algebra to make it back!"
};

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
  width: Math.floor((GRAPH_GROUP_PROPERTIES.width - (OFFSET * 2)) / 40) * 40,
  height: Math.floor((GRAPH_GROUP_PROPERTIES.height - (OFFSET * 2)) / 40) * 40,
  fill: "#161313"
};

const PIX_PER_UNIT = 40;

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
  text: DIALOGUE.level,
  fontSize: 24,
  fontFamily: "Arial",
  fill: "white"
};

const TRANSITION_GROUP_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x,
  y: DIALOGUE_BOX_PROPERTIES.height * (9/10) - OFFSET * 2,
  width: DIALOGUE_BOX_PROPERTIES.width,
  height: DIALOGUE_BOX_PROPERTIES.height * (1/10) + OFFSET * 2
};

const TRANSITION_BUTTON_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: TRANSITION_GROUP_PROPERTIES.width - OFFSET,
  height: TRANSITION_GROUP_PROPERTIES.height - OFFSET,
  fill: "#110808"
};

const TRANSITION_TEXT_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: TRANSITION_BUTTON_PROPERTIES.width,
  height: TRANSITION_BUTTON_PROPERTIES.height,
  text: "Go to minigame",
  fontSize: 24,
  fontFamily: "Arial",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
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
  fontSize: 16,
  fontFamily: "Arial",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

export {
  DIALOGUE,
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
  TRANSITION_GROUP_PROPERTIES,
  TRANSITION_BUTTON_PROPERTIES,
  TRANSITION_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES,
  PIX_PER_UNIT,
};
