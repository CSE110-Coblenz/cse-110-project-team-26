import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import "../../styles.css";

// Tutorial text

const TUTORIAL = {
  title: "Graphing Game Tutorial",
  step0: ""
    + "Hello space traveler! You've been on a mission for years "
    + "which has taken you all around the universe! You've gained "
    + "much treasure and fame, but now it's time to return to Earth.",
  step1: ""
    + "You will be plotting graphs to help your spaceship navigate space safely! "
    + "The goal is to submit a graph that goes through both points on the graph. "
    + "Use the keypad in the bottom to fill in the empty spaces in the equations. "
    + "Once you're satisfied, hit the submit button and see if you flew safely!",
  step2: ""
    + "If you ever need to see this tutorial again, hit the help button "
    + "in the top left of the screen. Have a safe mission!"
};

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
  gameOver: "<Dialogue>\nWelcome home space traveler! Congratulations on using your knowledge of algebra to make it back to Earth!"
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

// Level group and elements

const LEVEL_GROUP_PROPERTIES = {
  x: 0,
  y: 0,
  width: SIDEBAR_WIDTH,
  height: STAGE_HEIGHT * (2/7)
};

const LEVEL_BOX_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: BOX_WIDTH,
  height: LEVEL_GROUP_PROPERTIES.height - (OFFSET * 2),
  fill: "#FFF3F3"
};

const LEVEL_TEXT_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: LEVEL_BOX_PROPERTIES.width,
  height: LEVEL_BOX_PROPERTIES.height,
  text: "Level 1",
  fontSize: 36,
  fontFamily: "medodica",
  fill: "black",
  align: "center",
  verticalAlign: "middle"
};

// Dialogue group and elements

const DIALOGUE_GROUP_PROPERTIES = {
  x: 0,
  y: LEVEL_GROUP_PROPERTIES.height,
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
  fontSize: 18,
  fontFamily: "medodica",
  fill: "white"
};

const TRANSITION_GROUP_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x,
  y: DIALOGUE_BOX_PROPERTIES.height * (11/12) - OFFSET * 2,
  width: DIALOGUE_BOX_PROPERTIES.width,
  height: DIALOGUE_BOX_PROPERTIES.height * (1/12) + OFFSET * 2
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
  fontSize: 20,
  fontFamily: "medodica",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

const RESULTS_GROUP_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x,
  y: DIALOGUE_BOX_PROPERTIES.height * (11/12) - OFFSET * 2,
  width: DIALOGUE_BOX_PROPERTIES.width,
  height: DIALOGUE_BOX_PROPERTIES.height * (1/12) + OFFSET * 2
};

const RESULTS_BUTTON_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: RESULTS_GROUP_PROPERTIES.width - OFFSET,
  height: RESULTS_GROUP_PROPERTIES.height - OFFSET,
  fill: "#110808"
};

const RESULTS_TEXT_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: RESULTS_BUTTON_PROPERTIES.width,
  height: RESULTS_BUTTON_PROPERTIES.height,
  text: "Go to results",
  fontSize: 20,
  fontFamily: "medodica",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

const TUTORIAL_GROUP_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x,
  y: DIALOGUE_BOX_PROPERTIES.height * (11/12) - OFFSET * 2,
  width: DIALOGUE_BOX_PROPERTIES.width,
  height: DIALOGUE_BOX_PROPERTIES.height * (1/12) + OFFSET * 2
};

const TUTORIAL_BUTTON_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: TUTORIAL_GROUP_PROPERTIES.width - OFFSET,
  height: TUTORIAL_GROUP_PROPERTIES.height - OFFSET,
  fill: "#110808"
};

const TUTORIAL_TEXT_PROPERTIES = {
  x: OFFSET * 0.5,
  y: OFFSET * 0.5,
  width: TUTORIAL_BUTTON_PROPERTIES.width,
  height: TUTORIAL_BUTTON_PROPERTIES.height,
  text: "Show tutorial",
  fontSize: 20,
  fontFamily: "medodica",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

// Equation/Input group and elements

const INPUT_AND_EQUATION_GROUP_PROPERTIES = {
  x: 0,
  y: DIALOGUE_GROUP_PROPERTIES.height + LEVEL_GROUP_PROPERTIES.height,
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
  y: INPUT_AND_EQUATION_BOX_PROPERTIES.y + (OFFSET * (0.25)),
  width: BOX_WIDTH - (OFFSET),
  height: (INPUT_AND_EQUATION_BOX_PROPERTIES.height * (1/4)) - OFFSET * 0.5,
  fill: "#110808"
};

const EQUATION_TEXT_PROPERTIES = {
  x: EQUATION_BOX_PROPERTIES.x,
  y: EQUATION_BOX_PROPERTIES.y,
  width: EQUATION_BOX_PROPERTIES.width,
  height: EQUATION_BOX_PROPERTIES.height,
  fontSize: 18,
  fontFamily: "medodica",
  fill: "white",
  align: "center",
  verticalAlign: "middle"
};

export {
  DIALOGUE,
  TUTORIAL,
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
  LEVEL_GROUP_PROPERTIES,
  LEVEL_BOX_PROPERTIES,
  LEVEL_TEXT_PROPERTIES,
  DIALOGUE_GROUP_PROPERTIES,
  DIALOGUE_BOX_PROPERTIES,
  DIALOGUE_TEXT_PROPERTIES,
  TRANSITION_GROUP_PROPERTIES,
  TRANSITION_BUTTON_PROPERTIES,
  TRANSITION_TEXT_PROPERTIES,
  RESULTS_GROUP_PROPERTIES,
  RESULTS_BUTTON_PROPERTIES,
  RESULTS_TEXT_PROPERTIES,
  TUTORIAL_GROUP_PROPERTIES,
  TUTORIAL_BUTTON_PROPERTIES,
  TUTORIAL_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES,
  PIX_PER_UNIT,
};
