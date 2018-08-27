// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  //game status
  this.stats = {
  health: 100,
  fun: 100,
  };

  //pet health and fun decay
  this.decayRates = {
    health: -5,
    fun: -2
  }
};


// executed once, after assets were loaded
gameScene.create = function() {
  //game background
  this.background = this.add.sprite(0,0,'backyard').setOrigin(0,0).setInteractive();

  //event listener for the background
  this.background.on('pointerdown', this.placeItem, this);

  //adds pet sprite sheet
  this.pet = this.add.sprite(100,200,'pet', 0).setInteractive();
  this.pet.depth = 1;
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

  //show stats to user
  this.createHud();
  this.refreshHud();

  //decay of health and fun over time
  this.timedEventStats = this.time.addEvent({
    delay: 1000,
    repeat: -1, //repeats forever
    callback: function(){
     //update stats
     this.updateStats(this.decayRates)
    },
    callbackScope:this
  })
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
    this.rotateBtn.customStats = {health: 0, fun: 20};
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
  this.alpha = 0.5;
  
  let scene = this.scene;
  //set scene back to ready
  //setTimeout(function(){
    //scene.uiReady();
  //},2000);

  //rotation tween
  let rotateTween = this.scene.tweens.add({
    targets: this.scene.pet,
    duration: 600,
    angle: 720,
    pause: false,
    callbackScope: this,
    onComplete: function(tween, sprites){
      //update stats
      this.scene.updateStats(this.customStats)
      //set UI to ready
      this.scene.uiReady();
    }
  });
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

//place a new item on the background
gameScene.placeItem = function(pointer, localX,localY){
  //check that an item was selected
  if(!this.selectedItem) return;

  //ui must be unblocked
  if(this.uiBlocked) return;

  //create a new item in the position that the player clicked
  let newItem = this.add.sprite(localX,localY, this.selectedItem.texture.key);

  //block ui
  this.uiBlocked = true;

  //pet movement tween
  let petTween = this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: newItem.x,
    y: newItem.y,
    paused: false,
    callbackScope: this,
    onComplete: function(tween, sprites){
      //destroy item that was created
      newItem.destroy();

      //event listener for when spritesheet animation ends
      this.pet.on('animationcomplete',function(){
        //set pet back to neutral face
        this.pet.setFrame(0);
        //clear UI
        this.uiReady();
      },this);
      //sprite sheet animation
      this.pet.play('funnyfaces')

      //update stats
      this.updateStats(this.selectedItem.customStats);

    }
  });
};

gameScene.createHud = function(){
  //health stat
  this.healthText = this.add.text(20,20,'Health: ',{
    font: '23px Arial',
    fill:'#ffffff'
  });
  //fun stat
  this.funText = this.add.text(150,20,'Fun: ',{
    font: '23px Arial',
    fill:'#ffffff'
    });
};

//show the current value of health and fun
gameScene.refreshHud = function(){
  this.healthText.setText('Health: ' + this.stats.health);
  this.funText.setText('Fun: ' + this.stats.fun);
};

// stat updater
gameScene.updateStats = function(statDiff){
  //flag to see if the game is over
  let isGameOver = false;
  //pet stats
  //this.stats.health += statDiff.health;
  //this.stats.fun += statDiff.fun;
  //same thing as above
  for(stat in statDiff){
    if(statDiff.hasOwnProperty(stat)){
      this.stats[stat] += statDiff[stat];
      //stats can't be less than 0
      if (this.stats[stat] < 0 ) {
        isGameOver = true;
        this.stats[stat] = 0;
        }
      }
    }
    this.refreshHud();
    //check to see if game has ended
    if(isGameOver) this.gameOver();
};

gameScene.gameOver = function(){
  //block ui
  this.uiBlocked = true;
  
  //change the frame of the pet
  this.pet.setFrame(4);

  //keep the game on for sometime then move on
  this.time.addEvent({
    delay:2000,
    repeat:0,
    callback:function(){
      this.scene.restart();
    },
    callbackScope: this
  });
}