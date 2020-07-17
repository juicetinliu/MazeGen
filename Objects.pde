class Cell{
  int x, y;
  int set;
  Cell up;
  Cell down;
  Cell left;
  Cell right;
  Wall upWall = null;
  Wall downWall = null;
  Wall leftWall = null;
  Wall rightWall = null;
  
  Cell(int x,int y){
    this.x = x; 
    this.y = y;
  }
  
  void addNeighbours(Cell up, Cell down, Cell left, Cell right){
    this.up = up;
    if(up != null){
      if(up.downWall == null){
        Wall newUpWall = new Wall(this, up, false);
        Walls.add(newUpWall);
        this.upWall = newUpWall;
      }else{
        this.upWall = up.downWall;
      }
    }    
    this.down = down;
    if(down != null){
      if(down.upWall == null){
        Wall newDownWall = new Wall(this, down, false);
        Walls.add(newDownWall);
        this.downWall = newDownWall;
      }else{
        this.downWall = down.upWall;
      }
    }
    this.left = left;
    if(left != null){
      if(left.rightWall == null){
        Wall newLeftWall = new Wall(this, left, true);
        Walls.add(newLeftWall);
        this.leftWall = newLeftWall;
      }else{
        this.leftWall = left.rightWall;
      }
    }
    this.right = right;
    if(right != null){
      if(right.leftWall == null){
        Wall newRightWall = new Wall(this, right, true);
        Walls.add(newRightWall);
        this.rightWall = newRightWall;
      }else{
        this.rightWall = right.leftWall;
      }
    }
  }
  
  void display(int cellSpacing){
    pushMatrix();
    rectMode(CORNER);
    translate(x*cellSpacing,y*cellSpacing);
    fill(255,50);
    rect(cellSpacing*0.1,cellSpacing*0.1,cellSpacing*0.8,cellSpacing*0.8);
    popMatrix();
  }
  
  void setSet(int i){
    this.set = i;
  }
  
  void setCellSet(int set){
    if(this.set != set){
      this.set = set;
    }
    if(upWall == null && up != null){
      if(up.set != set){
        up.setCellSet(set);
      }
    }
    if(downWall == null && down != null){
      if(down.set != set){
        down.setCellSet(set);
      }
    }
    if(leftWall == null && left != null){
      if(left.set != set){
        left.setCellSet(set);
      }
    }
    if(rightWall == null && right != null){
      if(right.set != set){
        right.setCellSet(set);
      }
    }
  }
  
  
  
  void matchWalls(){
    if(!Walls.contains(upWall)){
      this.upWall = null;
    }
    if(!Walls.contains(downWall)){
      this.downWall = null;
    }
    if(!Walls.contains(leftWall)){
      this.leftWall = null;
    }
    if(!Walls.contains(rightWall)){
      this.rightWall = null;
    }
  }
}

class Wall{
  boolean orientation; //false for horizontal wall, true for vertical wall
  Cell cellA;
  Cell cellB;
  float x; float y;
  
  Wall(Cell cell1, Cell cell2, boolean orientation){
    this.cellA = cell1;
    this.cellB = cell2;
    this.orientation = orientation;
    this.x = float(cell1.x + cell2.x + 1)/2;
    this.y = float(cell1.y + cell2.y + 1)/2;
  }
  
  void display(float cellSpacing){
    pushMatrix();
    rectMode(CENTER);
    translate(x*cellSpacing,y*cellSpacing);
    fill(0,255,255);
    if(orientation){
      rect(0,0,cellSpacing*0.2,cellSpacing*1.2);
      //triangle(0,cellSpacing*0.5,cellSpacing*0.1,cellSpacing*0.4,-cellSpacing*0.1,cellSpacing*0.4);
      //triangle(0,-cellSpacing*0.5,cellSpacing*0.1,-cellSpacing*0.4,-cellSpacing*0.1,-cellSpacing*0.4);
    }else{
      rect(0,0,cellSpacing*1.2,cellSpacing*0.2);
    }
    popMatrix();
  }
}

void initialiseCellWalls(int x, int y, int cellSpacing){
  int amountX = x/cellSpacing;
  int amountY = y/cellSpacing;
  CellGrid = new Cell[amountX][amountY];
  for(int i = 0; i < amountX; i++){
    for(int j = 0; j < amountY; j++){
      CellGrid[i][j] = null;
    }
  }
  //Cell firstCell = new Cell(0,0);
  //createNeighBourCellWalls(firstCell, x, y, cellSpacing);
  createNeighbourCellWalls(amountX, amountY);
  println(Cells.size());
  println(Walls.size());
  
}

//void createNeighBourCellWalls(Cell thisCell, int boundx, int boundy, int cellSpacing){
//  Cells.add(thisCell);
//  int x = thisCell.x;
//  int y = thisCell.y;
//  println(x,y, Cells.size());
//  CellGrid[x][y] = thisCell;
//  Cell upCell = ((y - 1)*cellSpacing >= 0 && CellGrid[x][y-1] == null)? new Cell(x,y-1): null;
//  if(upCell != null){
//    createNeighBourCellWalls(upCell, boundx, boundy, cellSpacing);
//  }
//  Cell downCell = ((y + 1)*cellSpacing < boundy && CellGrid[x][y+1] == null)? new Cell(x,y+1): null;
//  if(downCell != null){
//    createNeighBourCellWalls(downCell, boundx, boundy, cellSpacing);
//  }
//  Cell leftCell = ((x - 1)*cellSpacing >= 0 && CellGrid[x-1][y] == null)? new Cell(x-1,y): null;
//  if(leftCell != null){
//    createNeighBourCellWalls(leftCell, boundx, boundy, cellSpacing);
//  }
//  Cell rightCell = ((x + 1)*cellSpacing < boundx && CellGrid[x+1][y] == null)? new Cell(x+1,y): null;
//  if(rightCell != null){
//    createNeighBourCellWalls(rightCell, boundx, boundy, cellSpacing);
//  }
//}

void createNeighbourCellWalls(int amountX, int amountY){
  for(int i = 0; i < amountX; i++){
    for(int j = 0; j < amountY; j++){
      Cell thisCell = new Cell(i, j);
      Cells.add(thisCell);
      CellGrid[i][j] = thisCell;
    }
  }
  for(int i = 0; i < amountX; i++){
    for(int j = 0; j < amountY; j++){
      Cell thisCell = CellGrid[i][j];

      Cell upCell = (j-1 >= 0)? CellGrid[i][j-1] : null;
      Cell downCell = (j+1 < amountY)? CellGrid[i][j+1] : null;
      Cell leftCell = (i-1 >= 0)? CellGrid[i-1][j] : null;
      Cell rightCell = (i+1 < amountX)? CellGrid[i+1][j] : null;
      thisCell.addNeighbours(upCell, downCell, leftCell, rightCell);
    }
  }
}
