import { randomInt } from 'node:crypto';
import * as readline from 'node:readline'; 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class linearEquation{
    coefficient : number;
    constantLHS : number; //LHS = Left Hand Side
    constantRHS: number;  //RHS = Right Hand

    constructor(coefficient : number, constant : number, constantRHS : number){
        this.coefficient = coefficient;
        this.constantLHS = constant;
        this.constantRHS = constantRHS
    }
}

class quadraticEquation{
    leadingCoefficient : number;
    secondCoefficient : number;
    constantLHS : number;
    constantRHS : number;
    firstX : number;
    secondX : number;
    
    constructor(leadingCoefficient : number, secondCoefficient : number, constantLHS : number, constantRHS : number){
        this.leadingCoefficient = leadingCoefficient;
        this.secondCoefficient = secondCoefficient;
        this.constantLHS = constantLHS;
        this.constantRHS = constantRHS;
        this.firstX = 0;
        this.secondX = 0;
    }
}


function equationGenerator() : linearEquation { //edge case: dealing with 0x
    //formuala :ax + b = c
    var answerX = Math.floor(Math.random()*10);
    var a = Math.floor(Math.random() * 20);
    var b = Math.floor(Math.random() * 20);
    var c = (a * answerX) + b;
    const randomBool = Math.random() < 0.5;
    if(randomBool){ //decides if the constant will be positive or negative
        b = -b;
    }
    const equation = new linearEquation(a,b,c)
    return equation;
}


function linearStepOne(equation : linearEquation) : number { //move constant to the other side
    var correctChoice;
    if(equation.constantLHS < 0){
        equation.constantRHS = Math.abs(equation.constantLHS) + equation.constantRHS
        correctChoice = Math.abs(equation.constantLHS)
        return correctChoice
    }
    equation.constantRHS = equation.constantRHS - equation.constantLHS
    correctChoice = - equation.constantLHS;
    return correctChoice;
}

function linearStepTwo(equation : linearEquation) : number {
    var correctChoice = equation.coefficient;
    equation.constantRHS = equation.constantRHS / equation.coefficient
    return correctChoice
}

function quadraticStepOne(equation : quadraticEquation, response : string) : boolean{ //labels
    const responses = response.split(",")
    if(equation.leadingCoefficient == parseInt(responses[0]!) && equation.secondCoefficient == parseInt(responses[1]!) && equation.constantLHS == parseInt(responses[2]!)){
        return true;
    }
    return false
}

function quadraticStepTwoPos(equation : quadraticEquation) : number{ // quadratic formula positive
    var a = equation.leadingCoefficient;
    var b = equation.secondCoefficient;
    var c = equation.constantLHS;
    var result = (-b + Math.sqrt((b*b) - (4 * (a*c))))/(2 * a)
    equation.firstX = result;
    return result;
}

function quadraticStepTwoNeg(equation : quadraticEquation) : number{ // quadratic formula positive
    var a = equation.leadingCoefficient;
    var b = equation.secondCoefficient;
    var c = equation.constantLHS;
    var result = (-b - Math.sqrt((b*b) - (4 * (a*c))))/(2 * a)
    equation.secondX = result;
    return result;
}

function questions(query: string): Promise<string>{
    return new Promise((resolve) => rl.question(query, resolve))
}



const linearEquation1 = equationGenerator();
const linearEquation2 = new linearEquation(5,0,15);
var quadraticEquation1 = new quadraticEquation(1,6,8,0)

async function linearGame(){
    console.log("You are given the following equation : " + linearEquation1.coefficient + "x " + "+ (" + linearEquation1.constantLHS + ") =" + linearEquation1.constantRHS)
    
    let choiceOne = await questions('Whats should be your first step?\n');
    if(parseInt(choiceOne) != linearStepOne(linearEquation1)){
        console.log("that is incorrect");
        rl.close();
        return;
    }
    console.log("Great! On to the next step")
    let choiceTwo = await questions('Now, you should divide by:\n');
    if(parseInt(choiceTwo) != linearStepTwo(linearEquation1)){
        console.log("that is incorrect");
        rl.close();
        return;  
    }
    console.log("Correct!\nx = " + linearEquation1.constantRHS)
    rl.close();
}

async function quadraticGame(){
    console.log("You are given the following equation : " + quadraticEquation1.leadingCoefficient + "x^2 " + quadraticEquation1.secondCoefficient + "x " + quadraticEquation1.constantLHS + " = " + quadraticEquation1.constantRHS)
    
    let choiceOne = await questions('Label the equation according to the quadratic formula\n');
    if(!quadraticStepOne(quadraticEquation1, choiceOne)){
        console.log("that is incorrect");
        rl.close();
        return;
    }
    console.log("Great! On to the next step")
    let choiceTwo = await questions('Solve the positive of the the quadratic equation:\n');
    if(parseInt(choiceTwo) != quadraticStepTwoPos(quadraticEquation1)){
        console.log("that is incorrect");
        rl.close();
        return;  
    }
    let choiceThree = await questions('Solve the negative of the the quadratic equation:\n');
    if(parseInt(choiceThree) != quadraticStepTwoNeg(quadraticEquation1)){
        console.log("that is incorrect");
        rl.close();
        return;  
    }

    console.log("Correct!\nx_1 = " + quadraticEquation1.firstX)
    console.log("Correct!\nx_2 = " + quadraticEquation1.secondX)
    rl.close();
}

//linearGame()
quadraticGame();

//console.log(equationGenerator())


/* console.log("Step One: " + stepOne(linearEquation2))
console.log("Step Two: " + stepTwo(linearEquation2))
console.log("x = " + linearEquation2.constantRHS)
 */