class Pathfinder{
  Cell currCell;
  Cell targetCell;
  boolean NOTDONE = true;
  ArrayList<Cell> openList = new ArrayList<Cell>();
  FloatList costs = new FloatList();
  ArrayList<Cell> closedList = new ArrayList<Cell>();
  int counter = 0;
  Pathfinder(Cell initial){
    this.currCell = initial;
    openList.add(initial);
    costs.append(0);
  }
  
  void display(float cellSpacing){
    rectMode(CORNER);
    if(targetCell != null){
      fill(255,255,0);
      rect(targetCell.x*cellSpacing,targetCell.y*cellSpacing,cellSpacing,cellSpacing);
    }
    fill(255,0,255);
    rect(currCell.x*cellSpacing,currCell.y*cellSpacing,cellSpacing,cellSpacing);
    
    for(Cell pathCell:closedList){
      fill(100,255,100);
      rect((pathCell.x+0.1)*cellSpacing,(pathCell.y+0.1)*cellSpacing,cellSpacing*0.8,cellSpacing*0.8);
    }
  }
  
  void run(){
    if(targetCell != null){
      iterate();
    }
  }
  
  void iterate(){
    counter++;
    if(openList.size() > 0 && NOTDONE && counter % 10 == 0){
      int minInd = costs.minIndex();
      currCell = openList.get(minInd);
      openList.remove(currCell);
      costs.remove(minInd);
      closedList.add(currCell);
      
      if(currCell.equals(targetCell)){
        print("DONE");
        NOTDONE = false;
      }else{
        ArrayList<Cell> neighbours = new ArrayList<Cell>();
        FloatList neighbourCosts = new FloatList();
        if(currCell.up != null && currCell.upWall == null){
          neighbours.add(currCell.up);
        }
        if(currCell.down != null && currCell.downWall == null){
          neighbours.add(currCell.down);
        }
        if(currCell.left != null && currCell.leftWall == null){
          neighbours.add(currCell.left);
        }
        if(currCell.right != null && currCell.rightWall == null){
          neighbours.add(currCell.right);
        }
        
        for(Cell neighbourCell: neighbours){
          if(!closedList.contains(neighbourCell)){
            float fCost = gCost(currCell,neighbourCell) + hCost(targetCell,neighbourCell);
            neighbourCosts.append(fCost);
            
            if(openList.contains(neighbourCell)){
              int neighbourInd = openList.indexOf(neighbourCell);
              if(fCost - hCost(targetCell,neighbourCell) < costs.get(neighbourInd) - hCost(targetCell,neighbourCell)){
                openList.add(neighbourCell);
                costs.append(fCost);
              }
            }else{
              openList.add(neighbourCell);
              costs.append(fCost);
            }
          }
        }
      
      
      }
    }
    //if(!NOTDONE){
    //  openList.clear();
    //  closedList.clear();
    //  costs.clear();
    //  openList.add(currCell);
    //  costs.append(0);
    //  targetCell = null;
    //  NOTDONE = true;
    //}
  }
}

float gCost(Cell startCell, Cell currCell){
  return abs(startCell.x - currCell.x) + abs(startCell.y - currCell.y);
  
}

float hCost(Cell endCell, Cell currCell){
  return dist(endCell.x, endCell.y, currCell.x,  currCell.y);
}
