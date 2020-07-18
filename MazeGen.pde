ArrayList<Cell> Cells = new ArrayList<Cell>();
ArrayList<Wall> Walls = new ArrayList<Wall>();

Cell[][] CellGrid; 

Cell currCell;

ArrayList<Wall> unusedWalls = new ArrayList<Wall>();
ArrayList<Cell> unvisitedCells = new ArrayList<Cell>();
ArrayList<Cell> stackCells = new ArrayList<Cell>();
boolean initialize = true;

int CellSpacing = 5;

Pathfinder josht;

void setup(){
  randomSeed(1);
  size(500,500);
  pixelDensity(displayDensity());
  initialiseCellWalls(500,500, CellSpacing);
  currCell = CellGrid[0][0];
  josht = new Pathfinder(currCell);
  //========== instant generation ==========
  generateMazeKruskal(false);
  //generateMazePrim(false);
  //generateMazeDepth(false);
}

void draw(){
  background(0);
  noStroke();
  //========== stepped generation ==========
  //generateMazeKruskal(true); 
  //generateMazePrim(true);
  //generateMazeDepth(true);
  
  for(Cell thisCell:Cells){
    thisCell.display(CellSpacing);
  }
  for(Wall thisWall:Walls){
    thisWall.display(CellSpacing);
  }
  rectMode(CORNER);
  fill(255,0,0);
  rect(currCell.x*CellSpacing,currCell.y*CellSpacing,CellSpacing,CellSpacing);
  
  josht.run();
  josht.display(CellSpacing);
}




void generateMazeKruskal(boolean step){ //true for step, false for instant
  //Randomized Kruskal's algorithm
  if(initialize){
    initialize = false;
    for(int i = 0; i < Cells.size(); i++){
      Cells.get(i).setSet(i);
    }
    for(Wall thisWall:Walls){
      unusedWalls.add(thisWall);
    }
  }
  boolean waitForStep = true;
  while(!allCellConnected() && waitForStep){
    if(step){
      waitForStep = false;
    }
    int chosenWallIndex = int(random(unusedWalls.size()));
    Wall chosenWall = unusedWalls.get(chosenWallIndex);
    Cell cellA = chosenWall.cellA;
    Cell cellB = chosenWall.cellB;
    if(cellA.set != cellB.set){
      Walls.remove(chosenWall);
      cellA.matchWalls();
      cellB.matchWalls();
      cellA.setCellSet(cellA.set);
    }
    unusedWalls.remove(chosenWall);
  }
}

boolean allCellConnected(){ //helper function for Kruskal's algorithm
  int set1 = Cells.get(0).set;
  for(int i = 1; i < Cells.size(); i++){
    if(set1 != Cells.get(i).set){
      return false;
    }
  }
  return true;
}

void generateMazePrim(boolean step){//true for step, false for instant
  //Randomized Prim's algorithm
  if(initialize){
    initialize = false;
    for(Cell thisCell:Cells){
      unvisitedCells.add(thisCell);
    }
    int chosenCellIndex = int(random(unvisitedCells.size()));
    Cell chosenCell = unvisitedCells.get(chosenCellIndex);
    unvisitedCells.remove(chosenCell);
    if(chosenCell.upWall != null) unusedWalls.add(chosenCell.upWall);
    if(chosenCell.downWall != null) unusedWalls.add(chosenCell.downWall);
    if(chosenCell.leftWall != null) unusedWalls.add(chosenCell.leftWall);
    if(chosenCell.rightWall != null) unusedWalls.add(chosenCell.rightWall);
  }
  boolean waitForStep = true;
  while(unusedWalls.size() > 0 && waitForStep){
    if(step){
      waitForStep = false;
    }
    int chosenWallIndex = int(random(unusedWalls.size()));
    Wall chosenWall = unusedWalls.get(chosenWallIndex);
    if((unvisitedCells.contains(chosenWall.cellA) && !unvisitedCells.contains(chosenWall.cellB))){
      Walls.remove(chosenWall);
      unusedWalls.remove(chosenWall);
      Cell unvisitedCell = chosenWall.cellA;
      Cell visitedCell = chosenWall.cellB;
      unvisitedCells.remove(unvisitedCell);
      visitedCell.matchWalls();
      unvisitedCell.matchWalls();
      if(unvisitedCell.upWall != null && !unusedWalls.contains(unvisitedCell.upWall)) unusedWalls.add(unvisitedCell.upWall);
      if(unvisitedCell.downWall != null && !unusedWalls.contains(unvisitedCell.downWall)) unusedWalls.add(unvisitedCell.downWall);
      if(unvisitedCell.leftWall != null && !unusedWalls.contains(unvisitedCell.leftWall)) unusedWalls.add(unvisitedCell.leftWall);
      if(unvisitedCell.rightWall != null && !unusedWalls.contains(unvisitedCell.rightWall)) unusedWalls.add(unvisitedCell.rightWall);
    }else if(unvisitedCells.contains(chosenWall.cellB) && !unvisitedCells.contains(chosenWall.cellA)){
      Walls.remove(chosenWall);
      unusedWalls.remove(chosenWall);
      Cell unvisitedCell = chosenWall.cellB;
      Cell visitedCell = chosenWall.cellA;
      unvisitedCells.remove(unvisitedCell);
      visitedCell.matchWalls();
      unvisitedCell.matchWalls();
      if(unvisitedCell.upWall != null && !unusedWalls.contains(unvisitedCell.upWall)) unusedWalls.add(unvisitedCell.upWall);
      if(unvisitedCell.downWall != null && !unusedWalls.contains(unvisitedCell.downWall)) unusedWalls.add(unvisitedCell.downWall);
      if(unvisitedCell.leftWall != null && !unusedWalls.contains(unvisitedCell.leftWall)) unusedWalls.add(unvisitedCell.leftWall);
      if(unvisitedCell.rightWall != null && !unusedWalls.contains(unvisitedCell.rightWall)) unusedWalls.add(unvisitedCell.rightWall);
    }else{
      unusedWalls.remove(chosenWall);
    }
  }
}

void generateMazeDepth(boolean step){ //true for step, false for instant
  //Recursive Backtracker
  if(initialize){
    initialize = false;
    for(int i = 0; i < Cells.size(); i++){
      Cells.get(i).setSet(0); // 0 is unvisited
    }
    Cell initial = Cells.get(0);
    stackCells.add(initial);
    initial.setSet(1); // 1 is visited
  }
  
  boolean waitForStep = true;
  while(stackCells.size() > 0 && waitForStep){
    if(step){
      waitForStep = false;
    }
    Cell poppedCell = stackCells.get(stackCells.size()-1);
    stackCells.remove(poppedCell);
    
    ArrayList<Wall> neighbourWalls = new ArrayList<Wall>();
    ArrayList<Cell> neighbourCells = new ArrayList<Cell>();
    
    if(poppedCell.up != null && poppedCell.up.set == 0){
      neighbourCells.add(poppedCell.up);
      neighbourWalls.add(poppedCell.upWall);
    }
    if(poppedCell.down != null && poppedCell.down.set == 0){
      neighbourCells.add(poppedCell.down);
      neighbourWalls.add(poppedCell.downWall);
    }
    if(poppedCell.left != null && poppedCell.left.set == 0){
      neighbourCells.add(poppedCell.left);
      neighbourWalls.add(poppedCell.leftWall);
    }
    if(poppedCell.right != null && poppedCell.right.set == 0){
      neighbourCells.add(poppedCell.right);
      neighbourWalls.add(poppedCell.rightWall);
    }
    
    if(neighbourCells.size() > 0){
      stackCells.add(poppedCell);
      int chosenNeighbourIndex = int(random(neighbourCells.size()));
      Cell chosenCell = neighbourCells.get(chosenNeighbourIndex);
      Wall chosenWall = neighbourWalls.get(chosenNeighbourIndex);
      Walls.remove(chosenWall);
      poppedCell.matchWalls();
      chosenCell.matchWalls();
      chosenCell.setSet(1);
      stackCells.add(chosenCell);
    }
  }
}

void mousePressed(){
  for(Cell thisCell:Cells){
    if(thisCell.mouseWithin(CellSpacing)){
      if(josht.targetCell == thisCell){
        josht.targetCell = null;
        break;
      }else{
        josht.targetCell = currCell;
        josht.openList.clear();
        josht.closedList.clear();
        josht.costs.clear();
        josht.openList.add(josht.currCell);
        josht.costs.append(0);
        josht.NOTDONE = true;
        break;
      }
    }
  }
}



void keyPressed(){ //play the maze!
  //setMove(keyCode, true);
  if(key == 'w'){
    if(currCell.upWall == null && currCell.up != null){
      currCell = currCell.up;
    }
  }
  if(key == 's'){
    if(currCell.downWall == null && currCell.down != null){
      currCell = currCell.down;
    }
  }
  if(key == 'a'){
    if(currCell.leftWall == null && currCell.left != null){
      currCell = currCell.left;
    }
  }
  if(key == 'd'){
    if(currCell.rightWall == null && currCell.right != null){
      currCell = currCell.right;
    }
  }
}
