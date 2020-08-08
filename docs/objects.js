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
    //pathfinding-use
    this.children = [];
    this.parent = null;
  }
  
  setChildren(childs){
    this.children = childs;
    childs.forEach(child => {
      if(child.parent === null){
        child.parent = this;
      }
    });
  }
  
  resetChildrenParents(){
    this.children = [];
    this.parent = null;
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
      rect(cellSpacing*0.1,cellSpacing*0.1,cellSpacing*0.8,cellSpacing*0.8);
    }
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
    fill('#6db8ed');
    if(this.orientation){
      rect(0,0,cellSpacing*0.2,cellSpacing*1.2);
    }else{
      rect(0,0,cellSpacing*1.2,cellSpacing*0.2);
    }
    pop();
  }
}

function initialiseCellWalls(x, y, cellSpacing){
  let amountX = (x - x%cellSpacing)/cellSpacing;
  let amountY = (y - y%cellSpacing)/cellSpacing;
  CellGrid = createArray(amountX, amountY);
  for(let i = 0; i < amountX; i++){
    for(let j = 0; j < amountY; j++){
      CellGrid[i][j] = null;
    }
  }
  createNeighbourCellWalls(amountX, amountY);
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
