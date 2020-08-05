class Pathfinder{
  constructor(initial) {
    this.initialCell = initial;
    this.currCell = initial;
    this.targetCell = null;
    this.NOTDONE = true;
    this.openList = [];
    this.costs = [];
    this.closedList = [];
    this.actualPath = [];
    this.counter = 0;
    this.pathCounter = 0;
    this.openList.push(initial);
    this.costs.push(0);
  }
  
  display(cellSpacing){
    rectMode(CORNER);
    if(this.targetCell !== null){
      fill(255,255,0);
      rect(this.targetCell.x*cellSpacing,this.targetCell.y*cellSpacing,cellSpacing,cellSpacing);
    }
    fill(255,0,255);
    rect(this.currCell.x*cellSpacing,this.currCell.y*cellSpacing,cellSpacing,cellSpacing);
    
    if(this.NOTDONE){
      this.closedList.forEach(pathCell => {
        fill('#ebf2aa');
        rect((pathCell.x+0.1)*cellSpacing,(pathCell.y+0.1)*cellSpacing,cellSpacing*0.8,cellSpacing*0.8);
      });
    }else{
      //this.actualPath.forEach(pathCell => {
      //  fill('#F06386');
      //  rect((pathCell.x+0.1)*cellSpacing,(pathCell.y+0.1)*cellSpacing,cellSpacing*0.8,cellSpacing*0.8);
      //});
    }
  }
  
  run(){
    if(this.targetCell !== null){
      this.iterate();
    }
    if(!this.NOTDONE){
      this.moveAlongPath();
    }
  }
  
  moveAlongPath(){
    this.counter++;
    if(this.currCell !== this.targetCell && this.counter % 5 === 0){
      this.currCell = this.actualPath[this.pathCounter];
      this.pathCounter++;
    }
  }
  
  backTrack(){
    while(this.currCell !== this.initialCell){
      this.actualPath.unshift(this.currCell);
      this.currCell = this.currCell.parent;
    }
  }
  
  iterate(){
    //this.counter++;  && this.counter % 1 === 0
    while(this.openList.length > 0 && this.NOTDONE){
      let minInd = indexOfSmallest(this.costs);
      this.currCell = this.openList[minInd];
      this.openList.splice(minInd,1);
      this.costs.splice(minInd, 1);
      this.closedList.push(this.currCell);
      
      if(this.currCell === this.targetCell){
        console.log("DONE");
        this.backTrack();
        this.NOTDONE = false;
      }else{
        let neighbours = [];
        let neighbourCosts = [];
        if(this.currCell.up !== null && this.currCell.upWall === null){
          neighbours.push(this.currCell.up);
        }
        if(this.currCell.down !== null && this.currCell.downWall === null){
          neighbours.push(this.currCell.down);
        }
        if(this.currCell.left !== null && this.currCell.leftWall === null){
          neighbours.push(this.currCell.left);
        }
        if(this.currCell.right !== null && this.currCell.rightWall === null){
          neighbours.push(this.currCell.right);
        }
        
        this.currCell.setChildren(neighbours);
        
        neighbours.forEach(neighbourCell => {
          if(this.closedList.indexOf(neighbourCell) === -1){
            let fCost = gCost(this.currCell, neighbourCell) + hCost(this.targetCell, neighbourCell);
            neighbourCosts.push(fCost);
            
            let openListNeighbourInd = this.openList.indexOf(neighbourCell);
            if(openListNeighbourInd !== -1){
              let hCostNeighbour = hCost(this.targetCell,neighbourCell);
              if(fCost - hCostNeighbour < this.costs[openListNeighbourInd] - hCostNeighbour){
                this.openList.push(neighbourCell);
                this.costs.push(fCost);
              }
            }else{
              this.openList.push(neighbourCell);
              this.costs.push(fCost);
            }
          }
        });
      
      
      }
    }
  }
}

function gCost(startCell, currCell){
  return abs(startCell.x - currCell.x) + abs(startCell.y - currCell.y);
  
}

function hCost(endCell, currCell){
  return dist(endCell.x, endCell.y, currCell.x,  currCell.y);
}

function indexOfSmallest(a) {
  let lowest = 0;
  for (let i = 1; i < a.length; i++) {
   if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
 }
