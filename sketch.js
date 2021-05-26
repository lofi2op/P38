var dog, happyDog, database, foodS, foodStock, fedTime, lastFed;
var bedImg,gardenImg,washroomImg;
var gameState = 0;

function preload() {
  dogImg = loadImage("images/dogImg.png")
  dogImg1 = loadImage("images/dogImg1.png")
  bedImg = loadImage("images/Bed Room.png")
  gardenImg = loadImage("images/Garden.png")
  washroomImg = loadImage("images/Wash Room.png")
  livingRoomImg = loadImage("images/Living Room.png")
  gardenImg = loadImage("images/Garden.png")
}

function setup() {
  createCanvas(1010, 760);

  database = firebase.database();
 
  foodStock = database.ref("Food");
  foodStock.on("value", function(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  })

   readState = database.ref("gameState");
   readState.on("value",function(data){
     gameState=data.val()
   });

   dog = createSprite(450, 200, 20, 20);
   foodObj = new Food();
}


function draw() {
  background(46, 139, 87);

  // if(foodS == 0){
  //   dog.addImage(dogImg1);
  //   milkBottle2.visible=false;
  // }else{
  //   dog.addImage(dogImg);
  //   milkBottle2.visible=true;
  // }

  if(gameState === 1){
    dog.addImage(dogImg);
    dog.scale = 0.5;
    dog.y=400;
    foodObj.display();
  }
  if(gameState === 2){
    dog.addImage(dogImg1);
    dog.scale = 0.5
    dog.y=400
    foodObj.display();
  }

  var Bath=createButton("I want to take bath");
  Bath.position(720,150);
  if(Bath.mousePressed(function(){
    gameState = 3;
    database.ref("/").update({"gameState":gameState})
  }));
  if(gameState===3){
    dog.addImage(washroomImg);
    dog.scale = 1;
    dog.y=400;
  }

  var Sleep=createButton("I am very sleepy");
  Sleep.position(720,180);
  if(Sleep.mousePressed(function(){
    gameState = 4;
    database.ref("/").update({"gameState":gameState})
  }));
  if(gameState === 4){
    dog.addImage(bedImg);
    dog.y=400;
  }

  var Play=createButton("Lets Play! ");
  Play.position(720,210);
  if(Play.mousePressed(function(){
    gameState = 5;
    database.ref("/").update({"gameState":gameState})
  }));
  if(gameState === 5){
    dog.addImage(livingRoomImg);
    dog.y=400;
  }

  var PlayInGarden = createButton("Lets Play In Park ");
  PlayInGarden.position(720,240);
  if(PlayInGarden.mousePressed(function(){
    gameState = 6;
    database.ref("/").update({"gameState":gameState})
  }));
  if(gameState === 6){
    dog.y = 400;
    dog.addImage(gardenImg)
  }

  database.ref("FeedTime").on("value", function (data) {
    lastFed = data.val();
  })

  fill(255, 255, 254);
  textSize(18);
  if (lastFed >= 12) {
    text("Last Fed : " + lastFed % 12 + " PM ", 720, 60);
  } else if (lastFed == 0) {
    text("Last Fed : 12 AM", 720, 60);
  } else {
    text("Last Fed : " + lastFed + " AM ", 720, 60)
  }
  
  feed = createButton("Feed the Dog");
  feed.position(720, 120);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(720, 90);
  addFood.mousePressed(addFoods);
  // currentTime=hour();
  // if(currentTime==(lastFed+1)){
  //   update("Playing");
  //   foodObj.garden();
  // }else if(currentTime==(lastFed+2)){
  //   update("Sleeping");
  //   foodObj.bedroom();
  // }else if(currentTime>(lastFed+2)){
  //   update("Bathing");
  //   foodObj.washroom();
  // }else{
  //   update("Hungry");
  //   foodObj.display();
  // }
  drawSprites();
}

function readStock(){
  foodS = data.val();
}
function writeStock(x){
  database.ref("/").update({
    food:x
  })
}

function feedDog() {
  //foodObj.updateFoodStock(1);

  gameState = 2;
  database.ref("/").update({"gameState":gameState})

  if (foodObj.getFoodStock() <= 0) {
    foodObj.updateFoodStock(foodObj.getFoodStock() * 0);
  }
  else {
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1)
  }

  //database = firebase.database();
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods() {
  foodS++;
  //foodObj.updateFoodStock(20);
  database.ref('/').update({
    Food: foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState:state
  });
}
