// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 600;

// Game settings
export const GAME_DURATION = 10; // seconds

export const LINEAR = "LINEAR";
export const QUADRATIC = "QUADRATIC";
export const ABSVAL = "ABSVAL";

export function generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}