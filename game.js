
var myGamePiece;
var myObstacles = [];
var myScore;
let myGoal;
let myTop;
let myMiddle;
let myBottom;
let score = 0;
let myCoins = [];
function startGame() {
    myGamePiece = new Cube(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new Score("15px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
    myGoal = new Component(30, 270, "blue", 450, 0);
    myTop = new Component(480, 90, "purple", 0, 0)
    myMiddle = new Component(480, 90, "orange", 0, 90)
    myBottom = new Component(480, 90, "brown", 0, 180)
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class Component {
    
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
    }
    update() {
        let ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Cube extends Component {
    constructor(width, height, color, x, y){
        super(width, height, color, x, y)
        this.speedX = 0.15;
        this.speedY = 0;
        this.gravity = 0;
        this.gravitySpeed = 0;
    }
    
    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    hitBottom() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    crashWith(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class Score extends Component {
    constructor(width, height, color, x, y) {
        super(width, height, color, x, y)
        this.score = 0;
    }
    update() {
        let ctx = myGameArea.context;
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }
}
// class Obstacle extends Component {
    
// }
// class Coin extends Component {

// }
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        }
    }
    if (myGamePiece.crashWith(myGoal)) {
        myGameArea.clear();
        score += 1000;
        myScore.text = "SCORE: " + score;
        myScore.update();
        myGamePiece.update();
        myGoal.update();
        clearInterval(myGameArea.interval)
        return;
    }
    if (myGamePiece.crashWith(myTop) || myGamePiece.crashWith(myBottom)) {
        score += 101;
    }
    else if (myGamePiece.crashWith(myMiddle)) {
        score += 51;
    }

    for (i = 0; i < myCoins.length; i += 1) {
        if (myGamePiece.crashWith(myCoins[i])) {
            myCoins.splice(i, 1);
            score += 100;
        }
    }
    myGameArea.clear();
    myTop.update();
    myMiddle.update();
    myBottom.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    if (myGameArea.frameNo == 75 || everyinterval(170) && !everyinterval(140)) {
        x = myGameArea.canvas.width;
        let currCoin = new Component(15, 15, "yellow", x, Math.floor(Math.random() * (256)));
        myCoins.push(currCoin);

    }

    for (i = 0; i < myCoins.length; i += 1) {
        myCoins[i].x += -1;
        myCoins[i].update();
    }
    
    myScore.text = "SCORE: " + score;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
    myGoal.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}