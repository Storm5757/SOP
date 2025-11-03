let img;

function preload() {
  img = loadImage('danmarkskort.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(220);
  if (img) {
    image(img, windowWidth/2, windowHeight/2, 860/1071*windowHeight, windowHeight);
  }
}
