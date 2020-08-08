let Cells = [];
let Walls = [];

let CellGrid = []; 

let currCell;

let unusedWalls = [];
let unvisitedCells = [];
let stackCells = [];
let initialize = true;
//let Buttons = [];

let CellSpacing = 25;
let josht;
let canvasWidth = 1000, canvasHeight = 500;
let mazeWidth = 1000, mazeHeight = 500;

let instantButton, steppedButton, genTypeSelect;
let genType = 'Kruskal';
let genTypePre = 'Kruskal';
let stepGen = false;

function setup(){
  //randomSeed(1);
  //createCanvas(windowWidth, windowHeight);
  setupHTML();
  initialiseCellWalls(mazeWidth, mazeHeight, CellSpacing);
  
  currCell = CellGrid[0][0];
  josht = new Pathfinder(currCell);
  
  
  
  //========== instant generation ==========
  generateMazeKruskal(false);
  //generateMazePrim(false);
  //generateMazeDepth(false);
}

function draw(){
  rectMode(CORNER);
  fill(50);
  stroke('#aaf1f2');
  strokeWeight(5);
  rect(0,0,mazeWidth, mazeHeight);
  //========== stepped generation ==========
  if(stepGen){
    stepGenDraw();
  }
  noStroke();
  Cells.forEach(thisCell => {thisCell.display(CellSpacing);});
  Walls.forEach(thisWall => {thisWall.display(CellSpacing);});
  rectMode(CORNER);
  fill(255,0,0);
  rect((currCell.x+0.1)*CellSpacing, (currCell.y+0.1)*CellSpacing, CellSpacing*0.8, CellSpacing*0.8);
  
  josht.run();
  josht.display(CellSpacing);
}

function setupHTML(){
  let canv = createCanvas(canvasWidth, canvasHeight);
  
  
  let canvcontainer = createDiv();
  canvcontainer.class('container');
  canv.parent(canvcontainer);
  
  let containerAll = createDiv();
  containerAll.class('container vert');
  
  let title = createDiv('Generate Maze');
  title.class('titleCard');
  title.parent(containerAll);
  
  let containerButt = createDiv();
  containerButt.class('hor');
  containerButt.parent(containerAll);
  
  instantButton = createDiv('Instant');
  instantButton.class('butts');
  instantButton.mousePressed(genMaze);
  instantButton.parent(containerButt);
  
  steppedButton = createDiv('Stepped');
  steppedButton.class('butts');
  steppedButton.mousePressed(stepGenMaze);
  steppedButton.parent(containerButt);

  genTypeSelect = createSelect();
  genTypeSelect.option('Kruskal');
  genTypeSelect.option('Prim');
  genTypeSelect.option('Depth');
  genTypeSelect.selected('Kruskal');
  genTypeSelect.changed(changeGenType);
  genTypeSelect.parent(containerAll);
}

function resetGrid() {
  stepGen = false;
  CellGrid = null;
  Cells = [];
  Walls = [];
  unusedWalls = [];
  unvisitedCells = [];
  stackCells = [];
  initialiseCellWalls(mazeWidth, mazeHeight, CellSpacing);
  initialize = true;
  currCell = CellGrid[0][0];
  josht = new Pathfinder(currCell);
}

function genMaze(){
  genType = genTypePre;
  resetGrid();
  switch(genType){
    case 'Kruskal':
      generateMazeKruskal(false);
      break;
    case 'Prim':
      generateMazePrim(false);
      break;
    case 'Depth':
      generateMazeDepth(false);
      break;
    default:
      generateMazeKruskal(false);
  }
}

function stepGenMaze(){
  genType = genTypePre;
  resetGrid();
  stepGen = true;
}

function stepGenDraw(){
  switch(genType){
    case 'Kruskal':
      generateMazeKruskal(true);
      break;
    case 'Prim':
      generateMazePrim(true);
      break;
    case 'Depth':
      generateMazeDepth(true);
      break;
    default:
      generateMazeKruskal(true);
  }
}

function changeGenType(){
  genTypePre = genTypeSelect.value();
}

function generateMazeKruskal(step){ //true for step, false for instant
  //Randomized Kruskal's algorithm
  if(initialize){
    initialize = false;
    for(let i = 0; i < Cells.length; i++){
      Cells[i].setSet(i);
    }
    Walls.forEach(thisWall => {
      unusedWalls.push(thisWall);
    });
  }
  let waitForStep = true;
  while(!allCellConnected() && waitForStep){
    
    if(step){
      waitForStep = false;
    }
    let chosenWallIndex = int(random(unusedWalls.length));
    let chosenWall = unusedWalls[chosenWallIndex];
    let cellA = chosenWall.cellA;
    let cellB = chosenWall.cellB;
    if(cellA.set !== cellB.set){
      let removeIndex = Walls.indexOf(chosenWall);
      Walls.splice(removeIndex, 1);
      cellA.matchWalls();
      cellB.matchWalls();
      cellA.setCellSet(cellA.set);
    }
    unusedWalls.splice(chosenWallIndex, 1);
  }
  if(allCellConnected() && stepGen){
    stepGen = false;
  }
}

function allCellConnected(){ //helper function for Kruskal's algorithm
  let set1 = Cells[0].set;
  for(let i = 1; i < Cells.length; i++){
    if(set1 !== Cells[i].set){
      return false;
    }
  }
  return true;
}

function generateMazePrim(step){ //true for step, false for instant
  //Randomized Prim's algorithm
  if(initialize){
    initialize = false;
    Cells.forEach(thisCell => {
      unvisitedCells.push(thisCell);
    });
    let chosenCellIndex = int(random(unvisitedCells.length));
    let chosenCell = unvisitedCells[chosenCellIndex];
    unvisitedCells.splice(chosenCellIndex, 1);
    if(chosenCell.upWall !== null){ unusedWalls.push(chosenCell.upWall); }
    if(chosenCell.downWall !== null){ unusedWalls.push(chosenCell.downWall); }
    if(chosenCell.leftWall !== null){ unusedWalls.push(chosenCell.leftWall); }
    if(chosenCell.rightWall !== null){ unusedWalls.push(chosenCell.rightWall); }
  }
  let waitForStep = true;
  while(unusedWalls.length > 0 && waitForStep){
    if(step){
      waitForStep = false;
    }
    let chosenWallIndex = int(random(unusedWalls.length));
    let chosenWall = unusedWalls[chosenWallIndex];
    if(unvisitedCells.indexOf(chosenWall.cellA) !== -1 && unvisitedCells.indexOf(chosenWall.cellB) === -1){
      Walls.splice(Walls.indexOf(chosenWall), 1);
      unusedWalls.splice(chosenWallIndex, 1);
      let unvisitedCell = chosenWall.cellA;
      let visitedCell = chosenWall.cellB;
      let unvisitedCellIndex = unvisitedCells.indexOf(unvisitedCell);
      unvisitedCells.splice(unvisitedCellIndex, 1);
      visitedCell.matchWalls();
      unvisitedCell.matchWalls();
      if(unvisitedCell.upWall !== null && unusedWalls.indexOf(unvisitedCell.upWall) === -1){ unusedWalls.push(unvisitedCell.upWall); }
      if(unvisitedCell.downWall !== null && unusedWalls.indexOf(unvisitedCell.downWall) === -1){ unusedWalls.push(unvisitedCell.downWall); }
      if(unvisitedCell.leftWall !== null && unusedWalls.indexOf(unvisitedCell.leftWall) === -1){ unusedWalls.push(unvisitedCell.leftWall); }
      if(unvisitedCell.rightWall !== null && unusedWalls.indexOf(unvisitedCell.rightWall) === -1){ unusedWalls.push(unvisitedCell.rightWall); }
    }else if(unvisitedCells.indexOf(chosenWall.cellB) !== -1 && unvisitedCells.indexOf(chosenWall.cellA) === -1){
      Walls.splice(Walls.indexOf(chosenWall), 1);
      unusedWalls.splice(chosenWallIndex, 1);
      let unvisitedCell = chosenWall.cellB;
      let visitedCell = chosenWall.cellA;
      let unvisitedCellIndex = unvisitedCells.indexOf(unvisitedCell);
      unvisitedCells.splice(unvisitedCellIndex, 1);
      visitedCell.matchWalls();
      unvisitedCell.matchWalls();
      if(unvisitedCell.upWall !== null && unusedWalls.indexOf(unvisitedCell.upWall) === -1){ unusedWalls.push(unvisitedCell.upWall); }
      if(unvisitedCell.downWall !== null && unusedWalls.indexOf(unvisitedCell.downWall) === -1){ unusedWalls.push(unvisitedCell.downWall); }
      if(unvisitedCell.leftWall !== null && unusedWalls.indexOf(unvisitedCell.leftWall) === -1){ unusedWalls.push(unvisitedCell.leftWall); }
      if(unvisitedCell.rightWall !== null && unusedWalls.indexOf(unvisitedCell.rightWall) === -1){ unusedWalls.push(unvisitedCell.rightWall); }
    }else{
      unusedWalls.splice(chosenWallIndex, 1);
    }
  }
  if(unusedWalls.length === 0 && stepGen){
    stepGen = false;
  }
}

function generateMazeDepth(step){ //true for step, false for instant
  //Recursive Backtracker
  if(initialize){
    initialize = false;
    for(let i = 0; i < Cells.length; i++){
      Cells[i].setSet(0); // 0 is unvisited
    }
    let initial = Cells[0];
    stackCells.push(initial);
    initial.setSet(1); // 1 is visited
  }
  
  let waitForStep = true;
  while(stackCells.length > 0 && waitForStep){
    if(step){
      waitForStep = false;
    }
    let poppedCell = stackCells[stackCells.length-1];
    stackCells.splice(stackCells.length-1,1);
    
    let neighbourWalls = [];
    let neighbourCells = [];
    
    if(poppedCell.up !== null && poppedCell.up.set === 0){
      neighbourCells.push(poppedCell.up);
      neighbourWalls.push(poppedCell.upWall);
    }
    if(poppedCell.down !== null && poppedCell.down.set === 0){
      neighbourCells.push(poppedCell.down);
      neighbourWalls.push(poppedCell.downWall);
    }
    if(poppedCell.left !== null && poppedCell.left.set === 0){
      neighbourCells.push(poppedCell.left);
      neighbourWalls.push(poppedCell.leftWall);
    }
    if(poppedCell.right !== null && poppedCell.right.set === 0){
      neighbourCells.push(poppedCell.right);
      neighbourWalls.push(poppedCell.rightWall);
    }
    
    if(neighbourCells.length > 0){
      stackCells.push(poppedCell);
      let chosenNeighbourIndex = int(random(neighbourCells.length));
      let chosenCell = neighbourCells[chosenNeighbourIndex];
      let chosenWall = neighbourWalls[chosenNeighbourIndex];
      Walls.splice(Walls.indexOf(chosenWall),1);
      poppedCell.matchWalls();
      chosenCell.matchWalls();
      chosenCell.setSet(1);
      stackCells.push(chosenCell);
    }
  }
  if(stackCells.length === 0 && stepGen){
    stepGen = false;
  }
}

function mousePressed(){
  Cells.forEach(thisCell => {
    if(thisCell.mouseWithin(CellSpacing)){
      if(josht.currCell !== thisCell){
        if(josht.targetCell === thisCell){
          josht.targetCell = null;
          Cells.forEach(thisCell => {thisCell.resetChildrenParents();});
          josht.reset();
          return;
        }else{
          josht.targetCell = thisCell;
          Cells.forEach(thisCell => {thisCell.resetChildrenParents();});
          josht.reset();
          return;
        }
      }
    }
  });
}

function keyPressed(){ //play the maze!
  if(key === 'w'){
    if(currCell.upWall === null && currCell.up !== null){
      currCell = currCell.up;
    }
  }
  if(key === 's'){
    if(currCell.downWall === null && currCell.down !== null){
      currCell = currCell.down;
    }
  }
  if(key === 'a'){
    if(currCell.leftWall === null && currCell.left !== null){
      currCell = currCell.left;
    }
  }
  if(key === 'd'){
    if(currCell.rightWall === null && currCell.right !== null){
      currCell = currCell.right;
    }
  }
}

//==============================================================================
//==============================================================================
//==============================================================================
