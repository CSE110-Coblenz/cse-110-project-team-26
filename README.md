# CSE 110 Team 26 - Vector Space

Our project is a space-themed game to help students from middle school and early high school learn how to solve and graph polynomial equations. The frontend is split up into a main game and two minigames, and the backend has user accounts and statistics tracking.

## Main Game

Users face linear, quadratic, and absolute value problems based on the difficulty. When a user is faced with a problem, they can input parameters to an equation using the game keypad. When the user hits the submit button, the graph they plotted is shown on the screen and they move on to the next minigame depending on correctness.

## Matching Minigame

Users have to draw lines from boxes with answers to boxes with equations. On submission, they receive feedback on incorrect submissions via an AI model generating explanations for the equations. 

## Maze Minigame

Users have to correctly select steps to solve each equation on screen between three choices within the time limit. This game also uses an AI model for equation feedback.

## Backend

There are three types of endpoints in the backend: user endpoints, statistics endpoints, and AI endpoints. The user endpoints handle registering and logging into accounts. The statistics endpoints are for making API calls when a user gets a question right or wrong. The AI endpoints are for explaining wrong answers in certain games.

## Testing

We have a CI/CD pipeline for testing code via Github Actions. These test frontend logic as well as the APIs used in the backend.

## Features

- User authentication
- Statistics screen
- AI feedback
- Tutorial screens
- Level system

## Technologies Used
- HTML
- CSS
- Typescript
- Konva
- Vite
- Node
- Express
- Gemini API
- MongoDB
