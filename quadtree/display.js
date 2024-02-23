const HEIGHT = 256;
const WIDTH = 256;
const board = new Quadtree(0,WIDTH-1,0,HEIGHT-1,"#ffffff");

const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

let DEPTH = false;
let BRUSH = "#000000";
let THICKNESS = 3;
function draw(startX, startY, endX, endY) {
  const dx = Math.abs(endX - startX);
  const dy = Math.abs(endY - startY);
  const sx = (startX < endX) ? 1 : -1;
  const sy = (startY < endY) ? 1 : -1;
  let err = dx - dy;
  const offsets = [];
  for (let i = -THICKNESS + 1; i < THICKNESS; i++) {
    offsets.push(i);
  }
  while (true) {
    for (const offsetX of offsets) {
      for (const offsetY of offsets) {
        try {
          
          if (BRUSH !== -1) {
            board.change(startX+offsetX,startY+offsetY,BRUSH);
          }
        } catch {}
      }
    }
    if (startX === endX && startY === endY) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      startX += sx;
    }
    if (e2 < dx) {
      err += dx;
      startY += sy;
    }
  }
  display();
}
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  return [y, x];
}
function draw2() {
  draw(CURRENT_POS[1],CURRENT_POS[0],LAST_POS[1],LAST_POS[0]);
  LAST_POS = [CURRENT_POS[0],CURRENT_POS[1]];
}
let LAST_POS = [-1,-1];
let CURRENT_POS = [-1,-1]
let IS_DOWN = false;
let lastInterval = -1;
canvas.addEventListener("mousedown", (event) => {
  const [y,x] = getMousePos(event);
  if (event.shiftKey) {
    setBrush(board.board[y][x].type);
    return;
  }
  IS_DOWN = true;
  draw(x,y,x,y);
  LAST_POS = [y,x];
  CURRENT_POS = [y,x];
  if (lastInterval != -1) {clearInterval(lastInterval);}
  lastInterval = setInterval(draw2,10);
});
canvas.addEventListener("mousemove", (event) => {
  if (IS_DOWN) {
    const [y,x] = getMousePos(event);
    draw2();
    LAST_POS = [CURRENT_POS[0],CURRENT_POS[1]];
    CURRENT_POS = [y,x];
  }
});
function draw2() {
  draw(CURRENT_POS[1],CURRENT_POS[0],LAST_POS[1],LAST_POS[0]);
  LAST_POS = [CURRENT_POS[0],CURRENT_POS[1]];
}
// window.addEventListener("keydown",function(e) {
//   if (e.altKey && e.keyCode == 78) {
    

//   }
// });
function setBrush(brush) {
  document.getElementById("brushColor").value = brush;
  BRUSH = brush;
}
function setBrushThickness(thickness) {
  THICKNESS = thickness;
  document.getElementById("brushThickness").innerHTML = thickness;

}
canvas.addEventListener("mouseup", (event) => {
  if (lastInterval != -1) {clearInterval(lastInterval);lastInterval = -1;}
  IS_DOWN = false;
});
canvas.addEventListener("mouseleave", (event) => {
  if (lastInterval != -1) {clearInterval(lastInterval);lastInterval = -1;}
  IS_DOWN = false;
});
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(c) {
  return "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2]);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}
function display() {
  document.getElementById("pixelsStored").innerHTML = pixelsStored;
  try{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {

      const t = 4*(j+(i*WIDTH));
      const [val,depth] = board.query(j,i);
      let [r,g,b] = hexToRgb(val);
      if (DEPTH) {
        r -= depth*20;
        g -= depth*20;
        b -= depth*20;
      }
      [data[t],data[t+1],data[t+2]] = [r,g,b];
      data[t+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
    }catch (err) {alert(err.message + "\n" + err.stack);}

}
display();
