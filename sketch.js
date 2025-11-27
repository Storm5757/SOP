let billede;
let skærmBredde = 1280;
let skærmHøjde = 550;
let maxKantVægt = 12;
let knap;
let combo1, combo2;

let graf;
let afstande;
let forgængere;
let tegnKortesteStiFlag = false;

class Stadion {
  constructor(id, x, y, meta = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.meta = meta;
    this.radius = 8;
  }

  display() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }

  displayLabel() {
    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(this.id, this.x, this.y - 8);
  }

  isMouseOver() {
    return dist(mouseX, mouseY, this.x, this.y) <= this.radius;
  }

  displayTooltip() {
    const lines = [];
    lines.push(this.meta.navn || `Navn: ${this.id}`);
    if (this.meta.bynavn) lines.push(`By: ${this.meta.bynavn}`);
    if (this.meta.kapacitet)
      lines.push(`Kapacitet: ${this.meta.kapacitet.toLocaleString()}`);
    if (this.meta.byggetår) lines.push(`Byggetår: ${this.meta.byggetår}`);
    textSize(12);
    const padding = 6;
    const w = max(...lines.map((l) => textWidth(l))) + padding * 2;
    const h = lines.length * 16 + padding * 2;
    let tx = mouseX + 12;
    let ty = mouseY + 12;
    if (tx + w > skærmBredde) tx = mouseX - w - 12;
    if (ty + h > skærmHøjde) ty = mouseY - h - 12;
    noStroke();
    fill(255, 255, 225, 230);
    rect(tx, ty, w, h, 6);
    fill(0);
    textAlign(LEFT, TOP);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], tx + padding, ty + padding + i * 16);
    }
  }
}

class Kanter {
  constructor(a, b, vægt) {
    this.a = a;
    this.b = b;
    this.vægt = vægt;
  }
}

class Graf {
  constructor() {
    this.noder = [];
    this.kanter = [];
  }
  tilføjeStadion(stadion) {
    this.noder.push(stadion);
  }
  tilføjeKant(a, b) {
    const d = dist(a.x, a.y, b.x, b.y);
    let w = Math.round(d / 20);
    this.kanter.push(new Kanter(a, b, w));
  }
  naboer(node) {
    const nabo = [];
    for (let e of this.kanter) {
      if (e.a === node) nabo.push({ node: e.b, vægt: e.vægt });
      else if (e.b === node) nabo.push({ node: e.a, vægt: e.vægt });
    }
    return nabo;
  }
  tegnKanter() {
    stroke(0, 0, 255, 150);
    strokeWeight(2);
    for (let e of this.kanter) {
      if (e.vægt < maxKantVægt) {
        line(e.a.x, e.a.y, e.b.x, e.b.y);
      }
    }
  }
  tegnNoder() {
    for (let n of this.noder) {
      n.display();
      n.displayLabel();
    }
  }
}

function initialiserDijkstra(graf, startNode) {
  afstande = {};
  forgængere = {};
  tegnKortesteStiFlag = false;
  for (let node of graf.noder) {
    afstande[node.id] = Infinity;
    forgængere[node.id] = null;
  }
  afstande[startNode.id] = 0;
}

function Dijkstra(startNode) {
  initialiserDijkstra(graf, startNode);

  let unvisited = new Set(graf.noder);

  while (unvisited.size > 0) {
    let currentNode = null;
    let currentDist = Infinity;
    for (let node of unvisited) {
      if (afstande[node.id] < currentDist) {
        currentDist = afstande[node.id];
        currentNode = node;
      }
    }
    unvisited.delete(currentNode);

    let naboer = [];
    for (let kant of graf.kanter) {
      if (kant.a === currentNode) {
        naboer.push(kant.b);
      } else if (kant.b === currentNode) {
        naboer.push(kant.a);
      }
    }
    for (let n of naboer) {
      let alt = afstande[currentNode.id] + getWeight(currentNode, n);
      if (alt < afstande[n.id]) {
        afstande[n.id] = alt;
        forgængere[n.id] = currentNode;
      }
    }
  }
  tegnKortesteStiFlag = true;

  return { forgængere, afstande };
}

function knapTrykt() {
  const startId = combo1.value();
  const slutId = combo2.value();
  if (startId === slutId) {
    alert("Start- og slutstadion må ikke være det samme!");
    return;
  } else if (!startId || !slutId) {
    alert("Vælg både start- og slutstadion!");
    return;
  } else {
    Dijkstra(
      graf.noder.find((n) => n.id === startId),
      graf.noder.find((n) => n.id === slutId)
    );
  }
}

function createUI() {
  combo1 = createSelect();
  combo1.position(width / 2 + 50, 20);

  combo1.option("A");
  combo1.option("B");
  combo1.option("C");
  combo1.option("D");
  combo1.option("E");
  combo1.option("F");
  combo1.option("G");

  combo2 = createSelect();
  combo2.position(width / 2 + 50, 60);
  combo2.option("A");
  combo2.option("B");
  combo2.option("C");
  combo2.option("D");
  combo2.option("E");
  combo2.option("F");
  combo2.option("G");

  knap = createButton("Find korteste vej");
  knap.position(width / 2 + 50, 100);
  knap.mousePressed(knapTrykt);

  return { combo1, combo2, button: knap };
}

function drawShortestPath(forgængere, startNode, slutNode) {
  let nuværendeNode = slutNode;
  stroke(255, 0, 0);
  strokeWeight(4);
  while (nuværendeNode && nuværendeNode !== startNode) {
    let forgængerNode = forgængere[nuværendeNode.id];
    if (forgængerNode) {
      line(nuværendeNode.x, nuværendeNode.y, forgængerNode.x, forgængerNode.y);
    }
    nuværendeNode = forgængerNode;
  }
  noStroke();
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  const totalDistance = afstande[slutNode.id];
  text(
    `Korteste afstand fra ${startNode.id} til ${slutNode.id}: ${totalDistance}`,
    10,
    height - 30
  );
}

function getWeight(a, b) {
  for (let e of graf.kanter) {
    if ((e.a === a && e.b === b) || (e.a === b && e.b === a)) {
      return e.vægt < maxKantVægt ? e.vægt : "-";
    }
  }
  return "-";
}

function tegnTabelOverVægte() {
  if (!graf || !graf.noder) return;

  const nodes = graf.noder;
  const n = nodes.length;
  let cellWidth = 52.25;
  let cellHeight = 20;

  for (let j = 0; j < n + 1; j++) {
    let x = j * cellWidth;
    let y = 10;
    stroke(0);
    noFill();
    rect(x, y, cellWidth, cellHeight);
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    if (j === 0) {
      text("Vægt", x + cellWidth / 2, y + cellHeight / 2);
    } else {
      text(nodes[j - 1].id, x + cellWidth / 2, y + cellHeight / 2);
    }
  }

  for (let i = 0; i < n; i++) {
    let rowY = (i + 1) * cellHeight + 10;

    stroke(0);
    noFill();
    rect(0, rowY, cellWidth, cellHeight);
    fill(0);
    noStroke();
    textSize(12);
    textAlign(CENTER, CENTER);
    text(nodes[i].id, cellWidth / 2, rowY + cellHeight / 2);

    for (let j = 0; j < n; j++) {
      let x = (j + 1) * cellWidth;
      stroke(0);
      noFill();
      rect(x, rowY, cellWidth, cellHeight);

      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      const weight = i === j ? "0" : getWeight(nodes[i], nodes[j]);
      text(weight, x + cellWidth / 2, rowY + cellHeight / 2);
    }
  }
}

function preload() {
  billede = loadImage("danmarkskort.png");
}

function tegnKort() {
  imageMode(CENTER);
  if (billede) {
    image(
      billede,
      skærmBredde / 2,
      skærmHøjde / 2,
      (860 / 1071) * skærmHøjde,
      skærmHøjde
    );
  }
}

function setup() {
  createCanvas(skærmBredde, skærmHøjde);
  createUI();

  graf = new Graf();

  graf.tilføjeStadion(
    new Stadion("A", 820, 330, {
      navn: "Parken",
      bynavn: "København",
      kapacitet: 38000,
      byggetår: 1992,
    })
  );
  graf.tilføjeStadion(
    new Stadion("B", 620, 250, {
      navn: "Ceres Park",
      bynavn: "Aarhus",
      kapacitet: 19000,
      byggetår: 1920,
    })
  );
  graf.tilføjeStadion(
    new Stadion("C", 465, 360, {
      navn: "Esbjerg Stadion",
      bynavn: "Esbjerg",
      kapacitet: 18000,
      byggetår: 1955,
    })
  );
  graf.tilføjeStadion(
    new Stadion("D", 630, 380, {
      navn: "Odense Stadion",
      bynavn: "Odense",
      kapacitet: 16000,
      byggetår: 1941,
    })
  );
  graf.tilføjeStadion(
    new Stadion("E", 590, 130, {
      navn: "Aalborg Stadion",
      bynavn: "Aalborg",
      kapacitet: 14000,
      byggetår: 2002,
    })
  );
  graf.tilføjeStadion(
    new Stadion("F", 510, 250, {
      navn: "FC Midtjylland Stadion",
      bynavn: "Herning",
      kapacitet: 12000,
      byggetår: 2004,
    })
  );
  graf.tilføjeStadion(
    new Stadion("G", 750, 400, {
      navn: "Næstved Stadion",
      bynavn: "Næstved",
      kapacitet: 10000,
      byggetår: 1944,
    })
  );

  graf.tilføjeKant(graf.noder[0], graf.noder[1]); // A-B
  graf.tilføjeKant(graf.noder[0], graf.noder[6]); // A-G
  graf.tilføjeKant(graf.noder[1], graf.noder[5]); // B-F
  graf.tilføjeKant(graf.noder[1], graf.noder[3]); // B-D
  graf.tilføjeKant(graf.noder[1], graf.noder[2]); // B-C
  graf.tilføjeKant(graf.noder[1], graf.noder[6]); // B-G
  graf.tilføjeKant(graf.noder[2], graf.noder[3]); // C-D
  graf.tilføjeKant(graf.noder[2], graf.noder[5]); // C-F
  graf.tilføjeKant(graf.noder[3], graf.noder[6]); // D-G
  graf.tilføjeKant(graf.noder[4], graf.noder[1]); // E-B
  graf.tilføjeKant(graf.noder[4], graf.noder[5]); // E-F
}

function tegnLabelsTilComboBoxes() {
  textSize(16);
  fill(0);
  noStroke();
  textAlign(RIGHT, CENTER);
  text("Vælg startstadion:", width / 2, 30);
  text("Vælg slutstadion:", width / 2, 70);
}

function draw() {
  background(220);
  tegnKort();
  tegnLabelsTilComboBoxes();
  graf.tegnKanter();
  graf.tegnNoder();

  const hovered = graf.noder.find((n) => n.isMouseOver());
  if (hovered) {
    hovered.displayTooltip();
  }
  tegnTabelOverVægte();
  if (tegnKortesteStiFlag) {
    const startId = combo1.value();
    const slutId = combo2.value();
    const startNode = graf.noder.find((n) => n.id === startId);
    const endNode = graf.noder.find((n) => n.id === slutId);
    drawShortestPath(forgængere, startNode, endNode);
  }
}
