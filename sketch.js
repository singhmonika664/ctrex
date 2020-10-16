//to give variables to game states
  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;

//to give variables to score
  var score=0;

//to give variables to objects
  var trex,ground,invisibleGround,gameOver,restart,sun;

//to give variables to animations
  var trex_running, trex_collided;

//to give variables to images
  var groundImg,sunImg,cloudImg,gameOverImg,   restartImg,backgroundImg,obstacle1, obstacle2, obstacle3, obstacle4;

//to give variables to groups
  var cloudsGroup,obstaclesGroup;

//to give variables to sounds
  var jumpSound, collidedSound;


//to load images,sounds & animations
function preload(){

//to load images  
  backgroundImg = loadImage("backgroundImg.png")
  sunImg = loadImage("sun.png");
  groundImg = loadImage("ground.png");
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
//to load animations   
  trex_running =          loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
//to load sounds
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
}


function setup() {
//to create a canvas of the windows size  
  createCanvas(windowWidth, windowHeight);

//to create new groups  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();  

//to create sprites of all variables according to windows size 
  sun = createSprite(width-50,100,10,10);
  invisibleGround = createSprite(width/2,height-10,width,125);
  ground = createSprite(width/2,height,width,2);
  trex = createSprite(50,height-70,20,50);
  gameOver = createSprite(width/2,height/2- 50);
  restart = createSprite(width/2,height/2);
  
//to add animation & images to all sprites  
  sun.addAnimation("sun", sunImg);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  gameOver.addImage(gameOverImg);
  ground.addImage("ground",groundImg);
  restart.addImage(restartImg);
  
//to adjust the size of the images  
  sun.scale = 0.1
  trex.scale = 0.08
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
//to set the visibility of sprites
 //to make the sprites invisibles 
  invisibleGround.visible=false;
  gameOver.visible = false;
  restart.visible = false;
  
//to set ground x position  
  ground.x = width/2;
  
//to adjust the size of the collider  
  trex.setCollider('circle',0,0,350)
  
//to set the score as 0  
  score = 0; 
}

function draw() {
//to set the background    
  background(backgroundImg);

//to display texts  
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
//divide the game into two game states
 //when the game state is play 
  if (gameState===PLAY){
    
  //to make the trex jump when the space key is pressed or screen is tapped
    if((touches.length > 0 ||keyDown("space"))&& trex.y >= height-120) {
      trex.velocityY = -13;
      //to add sound when trex jumps
      jumpSound.play();
      touches = [];
    } 
    
   //to maintain the score 
    score = score + Math.round(getFrameRate()/60);
    
   //to maintain the velocity of ground as per the score 
    ground.velocityX = -(6 + 3*score/100);
   
   //to provide gravity to the trex 
    trex.velocityY = trex.velocityY + 0.8
  
   //to reset the ground when the ground goes out of the canvas 
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
   //to collide the trex with the ground 
    trex.collide(invisibleGround);
    
   //calling the function spawnClouds in the draw function    to spawn the clouds  
    spawnClouds();
    
   //calling the function spawnObstacles in the draw function to spawn the obstacles   
    spawnObstacles();
   //to change the game state when trex touches the obstacles 
    if(obstaclesGroup.isTouching(trex)){
      //play the collided sound
       collidedSound.play()
      //change the game state to end
       gameState = END;
    }
 }
  
 //when the game state is end     
  else if (gameState === END) {
   //to make the images visibles 
    gameOver.visible = true;
    restart.visible = true;
    
   //set velocity of each sprite to 0
    ground.velocityX = 0;
    trex.velocityY = 0; 
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
   //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
   //set lifetime of the game objects so that they are        never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
   //to reset the game when reset button is clicked or touched
      if(touches.length>0 ||mousePressedOver(restart)) {
        //calling reset function in draw function
         reset();
        touches = []
    } 
 }
  
//to draw sprites  
  drawSprites();
}


//a seperate function for clouds
function spawnClouds() {
 //to randomly spawn clouds
  if (frameCount % 60 === 0) {
   //to create a spirte as clouds according to windows size
    var cloud = createSprite(width+20,height-300,40,10);
   //to spawn clouds at a random y axis 
    cloud.y = Math.round(random(100,400));
   //to adjust the size of the image cloud 
    cloud.scale = 0.5;
   //to set the velocity of cloud 
    cloud.velocityX = -3;
   //to add the image of cloud 
    cloud.addImage(cloudImg);
   //to assign a lifetime to clouds
    cloud.lifetime = 300;
   //adjust the depth of the trex and cloud
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
   //to adjust the depth of restart button and cloud
    cloud.depth = restart.depth;
    restart.depth = restart.depth+1;
   //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


//a seperate function for obstacles
function spawnObstacles() {
  //to randomly spawn obstacle
  if(frameCount % 60 === 0) {
   //to create a spirte as obstacles according to windows size  
    var obstacle = createSprite(600,height-95,20,30);
   //to adjust the size of the collider 
    obstacle.setCollider('circle',0,0,45)
   //to adjust the velocity of the obstacles according to    score
    obstacle.velocityX = -(6 + 3*score/100);
   //to generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
  //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
  //to adjust the lifetime of the obstacles   
    obstacle.lifetime = 300;
  //to adjust the depth of the trex and obstacle  
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
  //add each obstacle to the group
    obstaclesGroup.add(obstacle);
}
}


//a seperate function for reset 
function reset(){
 //when reset is clicked 
  //change the game state to play
  gameState = PLAY;
  //destroy obstacles and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //change the animation to running again
  trex.changeAnimation("running",trex_running);
  //to make the images invisible again
  gameOver.visible = false;
  restart.visible = false;
  //set the score to 0 again
  score = 0;
  //to set the frame count to 0
  frameCount = 0;
}
