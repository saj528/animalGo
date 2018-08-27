// create a new scene
let homeScene = new Phaser.Scene('Home');

homeScene.create = function(){
  //game background, with active input
  this.background = this.add.sprite(0,0,'backyard').setOrigin(0,0).setInteractive();

  // welcome text
  let gameWidth = this.sys.game.config.width
  let gameHeight = this.sys.game.config.height
  let text = this.add.text(gameWidth/2,gameHeight/2,'😊VIRTUAL PET',{
    font: '40px Arial',
    fill: '#ffffff'
  })
  text.setOrigin(0.5,0.5).depth = 1
  text.depth = 1
  // text background
  let textBackground = this.add.graphics();
  textBackground.fillStyle(0x000000,0.5);
  textBackground.fillRect(gameWidth/2 - text.width/2 - 10, gameHeight/2 - text.height/2 - 10, text.width + 20,text.height + 20)

  this.background.on('pointerdown',function(){
    this.scene.start('Game');
  },this)
};