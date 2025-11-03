let img;
let stadions;
let screenWidth = 1280;
let screenHeight = 550;

class Stadion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }
}

function preload() {
  img = loadImage("danmarkskort.png");
}

function drawMap() {
  imageMode(CENTER);
  if (img) {
    image(
      img,
      screenWidth / 2,
      screenHeight / 2,
      (860 / 1071) * screenHeight,
      screenHeight
    );
  }
}

function drawStadions() {
  for (let stadion of stadions) {
    stadion.display();
  }
}

function drawLinesBetweenStadions() {
  stroke(0, 0, 255);
  strokeWeight(2);
  for (let i = 0; i < stadions.length; i++) {
    for (let j = i + 1; j < stadions.length; j++) {
      line(stadions[i].x, stadions[i].y, stadions[j].x, stadions[j].y);
    }
  }
}

function setup() {
  createCanvas(screenWidth, screenHeight);
  stadions = [
    new Stadion(600, 250),
    new Stadion(630, 380),
    new Stadion(820, 330),
  ];
}

function draw() {
  background(220);
  drawMap();
  drawStadions();
  drawLinesBetweenStadions();
}
