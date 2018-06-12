var canvas = document.getElementById('MainCanvas');
var ctx = canvas.getContext('2d');
var rad = Math.PI *2 / 100;
var speed = 1.5;
var anim;

class Circle{
    constructor(color, lineWidth, range){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 100;
        this.color = color;
        this.lineWidth = lineWidth;
        this.range = range;
    }

    drawCircle(ctx){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.arc(this.x, this.y, this.radius, 0, rad * this.range, false);
        ctx.stroke();
    }
}

class Text{
    constructor(){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.color = '#F47C7C';
        this.font = '40px Arial';
    }

    drawText(ctx, percent){
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(percent.toFixed(0) + '%', this.x, this.y);
    }
}

function drawBackGround(){
    bctx.fillStyle = 'gray';
    bctx.fillRect(0, 0, bcanvas.width, bcanvas.height);
}

function drawFrame(){
    anim = window.requestAnimationFrame(drawFrame);
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    c2.range += rad * speed;
    c1.drawCircle(ctx);
    c2.drawCircle(ctx);
    text.drawText(ctx, c2.range);
}

let c1 = new Circle("#A5DEF1", 12, 100);
let c2 = new Circle("#49f", 12, 0);
let text = new Text();

drawFrame();


