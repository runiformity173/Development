let BRUSH_SIZE = 10;

const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");
function shuffle(t){let f=t.length,n;for(;0!=f;)n=Math.floor(Math.random()*f),f--,[t[f],t[n]]=[t[n],t[f]];return t}
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  return [y, x];
}
function hslToHex(t,a,r){console.log(t,a,r);var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}

canvas.addEventListener("mousedown", (event) => {
  const [y,x] = getMousePos(event);
  for (let i = y-BRUSH_SIZE;i<y+BRUSH_SIZE+1;i++) {
    if (i < 0 || i >= HEIGHT) continue;
    for (let j = x-BRUSH_SIZE;j<x+BRUSH_SIZE+1;j++) {
      if (j < 0 || j >= WIDTH) continue;
        chemB[i*WIDTH + j] = 1.0;
    }
  }
});

let frames = 0;
setInterval(function(){
  document.getElementById("fps").innerHTML = frames;
  frames = 0;
},1000)
function loop() {
  update();
  update();
  update();
  update();
  update();
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {
      const t = 4*(j+(i*WIDTH));
      data[t] = 255-Math.floor(chemB[i*(WIDTH) + j]*255)*2;
      data[t+1] = 255-Math.floor(chemB[i*(WIDTH) + j]*255)*2;
      data[t+2] = 255;
      // Math.floor(chemB[i*(WIDTH) + j]*255)*2
      // data[t+2] = Math.floor(chemA[i*(WIDTH) + j]*255);
      data[t+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  frames++;
  requestAnimationFrame(loop);
}
start();
requestAnimationFrame(loop);