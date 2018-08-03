// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //game status
  this.stats = {
  health: 100,
  fun: 100,
  };
};

// load asset files for our game
gameScene.preload = function() {
  
  // load assets
  this.load.image('backyard', 'assets/images/backyard.png');
  this.load.image('apple', 'assets/images/apple.png');
  this.load.image('candy', 'assets/images/candy.png');
  this.load.image('rotate', 'assets/images/rotate.png');
  this.load.image('toy', 'assets/images/rubber_duck.png');

  //load sprite sheet
  this.load.spritesheet('pet', 'assets/images/pet.png',{
    frameWidth: 97,
    frameHeight: 83,
    margin: 1,
    spacing: 1,
  });
};

// executed once, after assets were loaded
gameScene.create = function() {
  //game background
  this.background = this.add.sprite(0,0,'backyard').setOrigin(0,0)
  //adds pet sprite sheet
  this.pet = this.add.sprite(100,200,'pet', 0).setInteractive();
  // make pet draggable
  this.input.setDraggable(this.pet);
  //follow the pointer when dragging
  this.input.on('drag',function(pointer,gameObject,dragX,dragY){
    //make sprite be located at coord of the dragging
    gameObject.x = dragX;
    gameObject.y = dragY;
  });
  //calls create ui function
  this.createUi();
};

//creatue ui
gameScene.createUi = function(){
    //buttons
    this.appleBtn = this.add.sprite(72,570,'apple').setInteractive();
    this.appleBtn.customStats = {health: 20, fun: 0};
    this.appleBtn.on('pointerdown', this.pickItem);

    this.candyBtn = this.add.sprite(144,570,'candy').setInteractive();
    this.candyBtn.customStats = {health: -10, fun: 10};
    this.candyBtn.on('pointerdown', this.pickItem);
    
    this.toyBtn = this.add.sprite(216,570,'toy').setInteractive();
    this.toyBtn.customStats = {health: 0, fun: 15};
    this.toyBtn.on('pointerdown', this.pickItem);
    
    this.rotateBtn = this.add.sprite(288,570,'rotate').setInteractive();
    this.rotateBtn.on('pointerdown', this.rotatePet);

    //button array
    this.buttons = [this.appleBtn,this.candyBtn,this.toyBtn,this.rotateBtn]

    //ui is not blocked
    this.uiBlocked = false;

    //refresh ui;
    this.uiReady;
};

gameScene.rotatePet = function(){
  //the ui can't be blocked in order to rotate pet
  if(this.scene.uiBlocked) return;

  //make sure the ui is ready
  this.scene.uiReady();

  //block the ui
  this.scene.uiBlocked = true;

  //dim rotate icon 
  this.alpa = 0.5;
  
  let scene = this.scene;
  //set scene back to ready
  setTimeout(function(){
    scene.uiReady();
  },2000);

  console.log('we are rotating the pet')
};

gameScene.pickItem = function(){
  //the ui can't be blocked in order to get item
  if(this.scene.uiBlocked) return;

  //make sure the ui is ready
  this.scene.uiReady();

  // select item
  this.scene.selectedItem =  this;

  // change transparency of sprite
  this.alpha = 0.5;
  
  console.log('we are picking the ' + this.texture.key)
};

//set ui to ready
gameScene.uiReady = function(){
//nothing to be selected
this.selectedItem = null;

//set all buttons to aplha 1
for (let i = 0; i < this.buttons.length; i++){
  this.buttons[i].alpha = 1;
};

//scene must be unblocked
this.uiBlocked = false;



};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
