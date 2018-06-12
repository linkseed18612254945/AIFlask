class Table {
    constructor(){
        this.y = table_line;
        this.color = 'blue';
        this.lineWidth = 2;
    }

    draw(ctx){
        ctx.save();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, this.y);
        ctx.lineTo(canvas.width, this.y);
        ctx.stroke();
        ctx.restore();
    }

}

class Box {
    constructor(id, x, color){
        this.id = id;
        this.x = x;
        this.color = color;
        this.width = box_width;
        this.height = box_height;
        this.y = table_line - this.height;
        this.vx = speed;
        this.vy = speed;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.strokeRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '15px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.id, this.x, this.y + this.height / 2);
        ctx.restore();
    }
}

class Hook {
    constructor(){
        this.y = 40;
        this.x = canvas.width / 2;
        this.color = 'red';
        this.ropeWidth = 2;

        this.vx = speed;
        this.vy = speed;
    }

    draw(ctx){
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.ropeWidth;
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x - 10, this.y + 12);
        ctx.lineTo(this.x - 2, this.y + 24);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y + 12);
        ctx.lineTo(this.x + 2, this.y + 24);
        ctx.stroke();
        ctx.restore();
    }
}


class Animation{
    static drawFrame(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        table.draw(ctx);
        hook.draw(ctx);
        for (let box of boxes){
            box.draw(ctx);
        }
    }

    static runNext(){
        let nextStep = serial.shift();
        if (nextStep){
            if (nextStep instanceof Array){
                for (let operation of nextStep){
                    for (let arg in operation.args){
                        console.log(operation.args[arg]);
                        frameArgs[arg] = operation.args[arg];
                    }
                    console.log(frameArgs);
                    operation.animation();
                }
            }
            else{
                for (let arg in nextStep.args){
                    console.log(nextStep.args[arg]);
                    frameArgs[arg] = nextStep.args[arg];
                }
                console.log(frameArgs);
                nextStep.animation();
            }
        }
    }

    static pause(){
        setTimeout(Animation.runNext, frameArgs.pause_time);
    }
    
     static hookXMove(){
        let ani = window.requestAnimationFrame(Animation.hookXMove);
        Animation.drawFrame();
        hook.x += hook.vx * Math.sign(frameArgs.target_x - hook.x);
        if (Math.abs(hook.x - frameArgs.target_x) <= 2){
            window.cancelAnimationFrame(ani);
            Animation.runNext();
        }
    }

    static hookYMove(){
        let ani = window.requestAnimationFrame(Animation.hookYMove);
        Animation.drawFrame();
        hook.y += hook.vy * Math.sign(frameArgs.target_y - hook.y);
        if (Math.abs(hook.y - frameArgs.target_y) <= 2){
            window.cancelAnimationFrame(ani);
            Animation.runNext();
        }
    }

    static boxXMove(){
        let ani = window.requestAnimationFrame(Animation.boxXMove);
        Animation.drawFrame();
        frameArgs.box.x += frameArgs.box.vx * Math.sign(frameArgs.target_x - frameArgs.box.x);
        if (Math.abs(frameArgs.box.x - frameArgs.target_x) <= 2){
            window.cancelAnimationFrame(ani);
            Animation.runNext();
        }
    }

    static boxYMove(){
        let ani = window.requestAnimationFrame(Animation.boxYMove);
        Animation.drawFrame();
        frameArgs.box.y += frameArgs.box.vy * Math.sign(frameArgs.target_y - frameArgs.box.y);
        if (Math.abs(frameArgs.box.y - frameArgs.target_y) <= 2){
            window.cancelAnimationFrame(ani);
            Animation.runNext();
        }
    }

    static start(){
        Animation.runNext();
    }
}

class Step{
    constructor(animation, args){
        this.animation = animation;
        this.args = args;
    }
}

// 初始化环境参数
var canvas = document.getElementById('MainCanvas');
var ctx = canvas.getContext('2d');
var speed = 3;
var box_width = 40;
var box_height = 40;
var box_number = 5;
var table_line = canvas.height - canvas.height / 6;
var hoverHeight = 50;

// 创建操作对象，桌面，钩子和盒子
let table = new Table();
let hook = new Hook();
let boxes = [];
for (let i = 0; i < box_number; i+=1){
    let random_color = 'gray';
    boxes[i] = new Box(i + 1, 100 + i * box_width, random_color);
}

// 初始化控制参数
let frameArgs = {
    'pause_time': 250,
    'target_x': 0,
    'target_y': 0,
    'box': boxes[2]
};

// 创建操作动画步骤
let step1 = new Step(Animation.hookXMove, {'target_x': boxes[2].x});
let step2 = new Step(Animation.hookYMove, { 'target_y': boxes[2].y});
let pause_step = new Step(Animation.pause);
let step3 = [new Step(Animation.hookYMove, { 'target_y': hoverHeight}),
             new Step(Animation.boxYMove)];
let step4 = [new Step(Animation.hookXMove, { 'target_x': boxes[4].x}),
             new Step(Animation.boxXMove)];
let step5 = new Step(Animation.hookYMove, { 'target_y': boxes[4].y - box_height});
// let step5 = [new Step(Animation.hookYMove, { 'target_y': boxes[4].y - box_height}),
//              new Step(Animation.boxYMove)];
let serial = [step1, step2, pause_step, step3, step4, step5];

// 执行
Animation.start();
