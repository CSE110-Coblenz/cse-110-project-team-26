import { ComputeEngine } from "@cortex-js/compute-engine";
let compute = new ComputeEngine();

//trial for compute engine to check if it's working
function testComputeEngine() {
    try {
        let temp = compute.parse("3x+2+x");
        if((JSON.stringify(temp).includes("Undefined")||JSON.stringify(temp).includes("Error"))){
            throw "Compute engine error";
        }
    } catch (e) {
        console.error("Compute engine error:", e);
        compute = new ComputeEngine();
        testComputeEngine();
    }
}
testComputeEngine();

export { compute };

// Stage dimensions
export const STAGE_WIDTH = 900;
export const STAGE_HEIGHT = 600;

// Game settings
export const GAME_DURATION = 10; // seconds
export const LEVEL_COUNT = 5;

// Equation types
export const LINEAR = "LINEAR";
export const QUADRATIC = "QUADRATIC";
export const ABSVAL = "ABSVAL";

// Graph boundaries
export const Y_MIN = -20;
export const Y_MAX = 20;
export const X_MIN = -20;
export const X_MAX = 20;
