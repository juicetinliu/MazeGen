function setupHTML(){
  let maincontainer = createDiv();
  maincontainer.class('main');

  let canvcontainer = createDiv();
  canvcontainer.class('container');
  canvcontainer.parent(maincontainer);
  
  let canv = createCanvas(canvasWidth, canvasHeight);
  canv.parent(canvcontainer);
  
  let containerSidePanel = createDiv();
  containerSidePanel.class('side vert');
  containerSidePanel.parent(maincontainer);
  
  let containerTextPanel = createDiv();
  containerTextPanel.class('container vert');
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
  
  let containerBottom = createDiv();
  containerBottom.class('bot hor');
  containerBottom.parent(containerSidePanel);
  
  let gitButton = createA('https://github.com/juicetinliu/MazeGen', '', target="_blank" );
  gitButton.class('butts icon');
  gitButton.parent(containerBottom);
  
  let p5Button = createA('https://p5js.org', '', target="_blank" );
  p5Button.class('butts icon');
  p5Button.parent(containerBottom);

  let gitIcon = createImg('github.png', 'the p5 magenta asterisk');
  gitIcon.style('width: 40px');
  gitIcon.parent(gitButton);
  
  let p5Icon = createImg('https://p5js.org/assets/img/asterisk-01.png', 'the p5 magenta asterisk');
  p5Icon.style('width: 40px');
  p5Icon.parent(p5Button);
}
