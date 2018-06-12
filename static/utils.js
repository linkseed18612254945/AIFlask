window.utils = {};

window.utils.captureMouse = function (element) {
    let mouse = {x:0, y:0};
    element.addEventListener('mousemove', function (event) {
        let x, y;
        x = event.pageX;
        y = event.pageY;
        x -= element.offsetLeft;
        y -= element.offsetTop;
        mouse.x = x;
        mouse.y = y;
    }, false);
    return mouse;
};

window.utils.getRandomColor = function () {
    let r=Math.floor(Math.random()*256);
    let g=Math.floor(Math.random()*256);
    let b=Math.floor(Math.random()*256);
    return "rgb("+r+','+g+','+b+")";
};