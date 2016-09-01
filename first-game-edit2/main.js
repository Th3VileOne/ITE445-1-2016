var mainState = {
	
	preload: function(){
		game.load.image("player","assets/player.png")
		game.load.image('wallV', 'assets/wallVertical.png');
		game.load.image('wallH', 'assets/wallHorizontal.png');
		game.load.image('coin','assets/coin.png');
	},
	
	createWorld: function(){
		this.walls = game.add.group();
		this.walls.enableBody = true;
		
		game.add.sprite(0,0,'wallV',0,this.walls); //left wall
		game.add.sprite(480,0,'wallV', 0,this.walls); //right wall
		
		game.add.sprite(0,0,'wallH', 0, this.walls)//top left
		game.add.sprite(300,0,'wallH',0,this.walls);//top right
		game.add.sprite(0,320,'wallH',0,this.walls);//bottomLeft
		game.add.sprite(300,320,'wallH',0,this.walls);//bottomRight
		
		game.add.sprite(-100,160,'wallH',0,this.walls);//MidLeft
		game.add.sprite(400,160,'wallH',0,this.walls);//midRight
		
		var middleTop = game.add.sprite(100,80,'wallH',0,this.walls);
		middleTop.scale.setTo(1.5,1);
		var middleBottom = game.add.sprite(100,240,'wallH',0,this.walls);
		middleBottom.scale.setTo(1.5,1);
		
		//Set all walls to immovable
		this.walls.setAll('body.immovable',true);
	},
	create: function(){
		game.stage.backgroundColor = '#3498db';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.renderer.renderSession.roundPixels = true;
	//	var player = game.add.sprite(250,170,'player');
		this.player = game.add.sprite(game.width/2, game.height/170, 'player');
		this.player.anchor.setTo(0.5,0.5);
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 300;
		this.cursor = game.input.keyboard.createCursorKeys();
		
	//coins
		this.coin = game.add.sprite(60,140, 'coin');
		game.physics.arcade.enable(this.coin);
		this.coin.anchor.setTo(0.5,0.5);
		
	//score
		this.scoreLabel = game.add.text(30,30,'score: 0',{font: '18px Arial', fill: '#ffffff'});
		this.score = 0;
		
	//creating walls: left vertical
		//var leftWall=game.add.sprite(0,0,'wallV');
		//game.physics.arcade.enable(leftWall);
		//leftWall.body.immovable = true;
	//creating walls: right vertical
		//var rightWall = game.add.sprite(480,0,'wallV');
		//game.physics.arcade.enable(rightWall);
		//rightWall.body.immovable = true;	
		this.createWorld();
	}, 
	takeCoin: function(player,coin){
		this.score +=5;
		this.scoreLabel.text = 'score: ' + this.score;
		
		this.updateCoinPosition();
	},
	updateCoinPosition: function(){
		var coinPosition = [
		{x: 140, y: 60}, {x:360, y:60}, //TOP
		{x: 60, y:140}, {x:440, y:140}, //Mid
		{x: 130, y:300},  {x:370, y:300}//BOT
		
		];
		for (var i = 0;  i<coinPosition.length; i++){
			if(coinPosition[i].x == this.coin.x){
				coinPosition.splice(i,1);
			}
		}
	var newPosition = game.rnd.pick(coinPosition);
	
	this.coin.reset(newPosition.x,newPosition.y);
		
		
	},
	
	movePlayer: function(){
		if(this.cursor.left.isDown){
			this.player.body.velocity.x = -200;
		} else if(this.cursor.right.isDown){
			this.player.body.velocity.x = 200;
		} else{
			this.player.body.velocity.x=0;
		}
		
		if(this.cursor.up.isDown && this.player.body.touching.down){
			this.player.body.velocity.y = -275;
		}
	
	},
	playerDie:function(){
		game.state.start('main');
		
	},
	
	update: function(){
		game.physics.arcade.collide(this.player,this.walls);
		this.movePlayer();
		if(!this.player.inWorld){
			this.playerDie();
		}
		game.physics.arcade.overlap(this.player,this.coin,this.takeCoin, null,this);
	}
	
};
//END OF DECLARATION OF PRIMAL FUNCTIONS

var game = new Phaser.Game(500,340,Phaser.AUTO,'gameDiv');
	game.state.add('main', mainState);
	game.state.start('main');