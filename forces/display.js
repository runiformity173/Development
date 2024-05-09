const DISPLAY_WIDTH = 512;
const DISPLAY_HEIGHT = 512;

const canvas = document.getElementById("output");
canvas.width = DISPLAY_WIDTH;
canvas.height = DISPLAY_HEIGHT;
const ctx = canvas.getContext("2d");
const canvasTrail = document.getElementById("trails");
canvasTrail.width = DISPLAY_WIDTH;
canvasTrail.height = DISPLAY_HEIGHT;
const ctxTrail = canvasTrail.getContext("2d");

function randomizeColor() {
  const ccc = hslToHex(Math.random()*360,1,0.5);
  ctx.strokeStyle = `rgba(${ccc[0]},${ccc[1]},${ccc[2]},0.05)`;
}
function getMousePos(event) {
  const img = document.getElementById("output");
  const rect = img.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (img.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (img.height / rect.height));
  return [Math.floor(y/HEIGHT_MULTIPLIER), Math.floor(x/WIDTH_MULTIPLIER)];
}
// document.getElementById("output").addEventListener("click",function (e) {
//   const [y,x] = getMousePos(e);
//   moveParticle(clampPos(x),clampPos(y));
// });
function hslToHex(t,a,r){var o=t/60,t=(1-Math.abs(2*r-1))*a,a=t*(1-Math.abs(o%2-1)),r=r-t/2;let n,d,h;return[n,d,h]=0<=o&&o<1?[t,a,0]:1<=o&&o<2?[a,t,0]:2<=o&&o<3?[0,t,a]:3<=o&&o<4?[0,a,t]:4<=o&&o<5?[a,0,t]:[t,0,a],[Math.round(255*(n+r)),Math.round(255*(d+r)),Math.round(255*(h+r))]}
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = frames;frames = 0;},1000);
function trackObject(id) {
  tracking = id;
  ctxTrail.clearRect(0,0,DISPLAY_WIDTH,DISPLAY_HEIGHT);
  if (tracking == -1) {return;}
  lastX = objects[id].x;
  lastY = objects[id].y;
  
}

ctxTrail.strokeStyle = "#ffffff";
let lastX = 0;
let lastY = 0;
let tracking = -1;
function frame() {
  try {
  update();
  ctx.clearRect(0,0,DISPLAY_WIDTH,DISPLAY_HEIGHT);
  for (const object of objects) {
    ctx.beginPath();
    ctx.fillStyle = object.color;
    ctx.arc(object.x, object.y, object.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  if (tracking > -1) {
    ctxTrail.beginPath();
    ctxTrail.moveTo(lastX, lastY);
    ctxTrail.lineTo(objects[tracking].x,objects[tracking].y);
    ctxTrail.stroke();
    lastX = objects[tracking].x;
    lastY = objects[tracking].y;
  }
  } catch (err) {alert(err.stack);}
  frames++;
  requestAnimationFrame(frame);

}
requestAnimationFrame(frame);