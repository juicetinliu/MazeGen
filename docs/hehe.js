let Cells = [];
let Walls = [];

let CellGrid = []; 

let currCell = [];

let unusedWalls = [];
let unvisitedCells = [];
let stackCells = [];
let initialize = true;

let CellSpacing = 10;

function setup(){
  randomSeed(1);
  createCanvas(500, 500);
  initialiseCellWalls(500,500, CellSpacing);
  currCell = CellGrid[0][0];
  //josht = new Pathfinder(currCell);
  //========== instant generation ==========
  generateMazeKruskal(false);
  //generateMazePrim(false);
  //generateMazeDepth(false);
}

function draw(){
  background(0);
  noStroke();
  //========== stepped generation ==========
  //generateMazeKruskal(true); 
  //generateMazePrim(true);
  //generateMazeDepth(true);
  
  Cells.forEach(thisCell => {thisCell.display(CellSpacing);});
  Walls.forEach(thisWall => {thisWall.display(CellSpacing);});
  rectMode(CORNER);
  fill(255,0,0);
  rect(currCell.x*CellSpacing,currCell.y*CellSpacing,CellSpacing,CellSpacing);
  
  //josht.run();
  //josht.display(CellSpacing);
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

function generateMazePrim(step){//true for step, false for instant
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
}

function mousePressed(){
  Cells.forEach(thisCell => {
    if(thisCell.mouseWithin(CellSpacing)){
      //if(josht.targetCell == thisCell){
      //  josht.targetCell = null;
      //  return;
      //}else{
      //  josht.targetCell = thisCell;
      //  josht.openList.clear();
      //  josht.closedList.clear();
      //  josht.costs.clear();
      //  josht.openList.add(josht.currCell);
      //  josht.costs.append(0);
      //  josht.NOTDONE = true;
      //  return;
      //}
      console.log(thisCell);
    }
  });
}



function keyPressed(){ //play the maze!
  //setMove(keyCode, true);
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
  //console.log(currCell);
}

class Cell {
  constructor(x, y) {
    this.x = x; 
    this.y = y;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.upWall = null;
    this.downWall = null;
    this.leftWall = null;
    this.rightWall = null;
  }
  
  addNeighbours(up, down, left, right){
    this.up = up;
    if(up != null){
      if(up.downWall === null){
        let newUpWall = new Wall(this, up, false);
        Walls.push(newUpWall);
        this.upWall = newUpWall;
      }else{
        this.upWall = up.downWall;
      }
    }    
    this.down = down;
    if(down != null){
      if(down.upWall === null){
        let newDownWall = new Wall(this, down, false);
        Walls.push(newDownWall);
        this.downWall = newDownWall;
      }else{
        this.downWall = down.upWall;
      }
    }
    this.left = left;
    if(left != null){
      if(left.rightWall === null){
        let newLeftWall = new Wall(this, left, true);
        Walls.push(newLeftWall);
        this.leftWall = newLeftWall;
      }else{
        this.leftWall = left.rightWall;
      }
    }
    this.right = right;
    if(right != null){
      if(right.leftWall === null){
        let newRightWall = new Wall(this, right, true);
        Walls.push(newRightWall);
        this.rightWall = newRightWall;
      }else{
        this.rightWall = right.leftWall;
      }
    }
  }
  
  display(cellSpacing){
    push();
    rectMode(CORNER);
    translate(this.x*cellSpacing,this.y*cellSpacing);
    if(mouseX > this.x * cellSpacing && mouseX < (this.x + 1) * cellSpacing && mouseY > this.y * cellSpacing && mouseY < (this.y + 1) * cellSpacing){
      fill(255,100);
    }else{
      fill(255,50);
    }
    rect(cellSpacing*0.1,cellSpacing*0.1,cellSpacing*0.8,cellSpacing*0.8);
    pop();
  }
  
  mouseWithin(cellSpacing){
    if(mouseX > this.x * cellSpacing && mouseX < (this.x + 1) * cellSpacing && mouseY > this.y * cellSpacing && mouseY < (this.y + 1) * cellSpacing){
      return true;
    }else{
      return false;
    }
  }
  
  setSet(i){
    this.set = i;
  }
  
  setCellSet(set){
    if(this.set !== set){
      this.set = set;
    }
    if(this.upWall === null && this.up !== null){
      if(this.up.set !== set){
        this.up.setCellSet(set);
      }
    }
    if(this.downWall === null && this.down !== null){
      if(this.down.set !== set){
        this.down.setCellSet(set);
      }
    }
    if(this.leftWall === null && this.left !== null){
      if(this.left.set !== set){
        this.left.setCellSet(set);
      }
    }
    if(this.rightWall === null && this.right !== null){
      if(this.right.set !== set){
        this.right.setCellSet(set);
      }
    }
  }
  
  
  
  matchWalls(){
    if(Walls.indexOf(this.upWall) === -1){
      this.upWall = null;
    }
    if(Walls.indexOf(this.downWall) === -1){
      this.downWall = null;
    }
    if(Walls.indexOf(this.leftWall) === -1){
      this.leftWall = null;
    }
    if(Walls.indexOf(this.rightWall) === -1){
      this.rightWall = null;
    }
  }
}

class Wall{
  constructor(cell1, cell2, orien) {
    this.cellA = cell1;
    this.cellB = cell2;
    this.orientation = orien;
    this.x = float(cell1.x + cell2.x + 1)/2;
    this.y = float(cell1.y + cell2.y + 1)/2;
  }
  
  display(cellSpacing){
    push();
    rectMode(CENTER);
    translate(this.x*cellSpacing,this.y*cellSpacing);
    fill(0,255,255);
    if(this.orientation){
      rect(0,0,cellSpacing*0.2,cellSpacing*1.2);
    }else{
      rect(0,0,cellSpacing*1.2,cellSpacing*0.2);
    }
    pop();
  }
}

function initialiseCellWalls(x, y, cellSpacing){
  let amountX = x/cellSpacing;
  let amountY = y/cellSpacing;
  CellGrid = createArray(amountX, amountY);
  for(let i = 0; i < amountX; i++){
    for(let j = 0; j < amountY; j++){
      CellGrid[i][j] = null;
    }
  }
  createNeighbourCellWalls(amountX, amountY);
  //console.log(Cells.length);
  //console.log(Walls.length);
  //console.log(CellGrid);
}

function createArray(len) {
    var arr = new Array(len || 0),
        i = len;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--){ arr[len-1 - i] = createArray.apply(this, args);}
    }
    return arr;
}


function createNeighbourCellWalls(amountX, amountY){
  for(let i = 0; i < amountX; i++){
    for(let j = 0; j < amountY; j++){
      let thisCell = new Cell(i, j);
      Cells.push(thisCell);
      CellGrid[i][j] = thisCell;
    }
  }
  for(let i = 0; i < amountX; i++){
    for(let j = 0; j < amountY; j++){
      let thisCell = CellGrid[i][j];

      let upCell = (j-1 >= 0)? CellGrid[i][j-1] : null;
      let downCell = (j+1 < amountY)? CellGrid[i][j+1] : null;
      let leftCell = (i-1 >= 0)? CellGrid[i-1][j] : null;
      let rightCell = (i+1 < amountX)? CellGrid[i+1][j] : null;
      thisCell.addNeighbours(upCell, downCell, leftCell, rightCell);
    }
  }
}
