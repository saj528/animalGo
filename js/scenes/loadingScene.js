// create a new scene
let loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function(){

  //show logo
  let logo = this.add.sprite(this.sys.game.config.width/2,250,'logo')

  //progress bar background
  let backgroundBar = this.add.graphics();
  let barWidth = 150;
  let barHeight = 30;
  backgroundBar.setPosition(this.sys.game.config.width/2 - barWidth/2,this.sys.game.config.height/2 - barHeight/2)
  backgroundBar.fillStyle(0xF5F5F5, 1);
  backgroundBar.fillRect(0,0,barWidth,barHeight)

  //progress bar
  let progressBar = this.add.graphics();
  progressBar.setPosition(this.sys.game.config.width/2 - barWidth/2,this.sys.game.config.height/2 - barHeight/2)

  //listen to the progress event
  this.load.on('progress',function(value){
    //clearing progress bar so we can draw it again
    progressBar.clear();
    //set style
    progressBar.fillStyle(0x9AD98D,1)

    //draw rectangle
    progressBar.fillRect(0,0,value * barWidth,barHeight)
  },this);

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

loadingScene.create = function(){
    //animation
    this.anims.create({
      key: 'funnyfaces',
      frames: this.anims.generateFrameNames('pet', {frames: [1,2,3]}),
      frameRate: 7,
      yoyo:true,
      repeat: 0 //1 for 1 repeat, -1 for repeating forever
    });
  
  this.scene.start('Home');
};