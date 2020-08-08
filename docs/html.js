function setupHTML(){
  let canvcontainer = createDiv();
  canvcontainer.class('container');
  
  let canv = createCanvas(canvasWidth, canvasHeight);
  canv.parent(canvcontainer);
  
  let containerSidePanel = createDiv();
  containerSidePanel.class('vert');
  
  let containerTextPanel = createDiv();
  containerTextPanel.class('container');
  containerTextPanel.parent(containerSidePanel);
  
  let text1 = createDiv('Click cell to set target for A* bot');
  text1.class('text');
  text1.parent(containerTextPanel);
  
  let text2 = createDiv('Arrow keys or W,A,S,D to navigate maze');
  text2.class('text');
  text2.parent(containerTextPanel);
  
  let containerGenPanel = createDiv();
  containerGenPanel.class('container vert');
  containerGenPanel.parent(containerSidePanel);
  
  let containerGenMethod = createDiv();
  containerGenMethod.class('hor');
  containerGenMethod.parent(containerGenPanel);
  
  instantButton = createDiv('Instant');
  instantButton.class('butts regularbut selected');
  instantButton.mousePressed(function() {changeGenMethod(1);});
  instantButton.parent(containerGenMethod);
  
  steppedButton = createDiv('Stepped');
  steppedButton.class('butts regularbut');
  steppedButton.mousePressed(function() {changeGenMethod(2);});
  steppedButton.parent(containerGenMethod);

  let containerGenAlgo = createDiv();
  containerGenAlgo.class('selcontainer hor');
  containerGenAlgo.parent(containerGenPanel);
  
  krusSel = createDiv('Kruskal');
  krusSel.class('sel selL selected');
  krusSel.mousePressed(function() {changeGenAlgo('Kruskal');});
  krusSel.parent(containerGenAlgo);
  
  primSel = createDiv('Prim');
  primSel.class('sel selC');
  primSel.mousePressed(function() {changeGenAlgo('Prim');});
  primSel.parent(containerGenAlgo);
  
  depthSel = createDiv('Depth');
  depthSel.class('sel selR');
  depthSel.mousePressed(function() {changeGenAlgo('Depth');});
  depthSel.parent(containerGenAlgo);
  
  let mainButton = createDiv('Generate Maze');
  mainButton.class('butts generate');
  mainButton.mousePressed(genMaze);
  mainButton.parent(containerGenPanel);
}
