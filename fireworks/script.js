const WIDTH = 256;
const HEIGHT = 160;
const FRAMES_PER_ADD = 30;
const overallLength = WIDTH*HEIGHT;
let board = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => new Array(3).fill(0)));
const clamp = (o,m1,m2)=>(Math.min(Math.max(o,m1),m2));
// board.board[0][2].type = 1;
// console.log(board.board)
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
function addRandomColor(y,x) {
  let total = 390+Math.floor(Math.random()*30);
  const final = [0,0,0];
  board[y][x] = hslToHex(Math.floor(Math.random()*360),(71+Math.floor(Math.random()*30))/100,0.5);
}
canvas.addEventListener("mousedown", (event) => {
  const [y,x] = getMousePos(event);
  addRandomColor(y,x);
});
let updateOrder = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
function update() {
  const newBoard = [];
  for (var i = 0;i<HEIGHT;i++) {
    newBoard.push([]);
    for (var j = 0;j<WIDTH;j++) {
      let l = [...board[i][j]];
      if (l[0] == 0 && l[1] == 0 && l[2] == 0) {
        
        // shuffle(updateOrder);
        // for (const pos of updateOrder) {
          const [y,x] = updateOrder[Math.floor(Math.random()*8)];
          const ny = i+y;const nx = j+x;
          if (ny<HEIGHT && ny>=0 && nx<WIDTH && nx>=0) {
            if (board[ny][nx][0] != 0 || board[ny][nx][2] != 0 || board[ny][nx][1] != 0) {
              l = [...board[ny][nx]];
              // break;
            }
          }
        // }
      } else {
        var lll = 1;
        const [y,x] = updateOrder[Math.floor(Math.random()*8)];
        const ny = i+y;const nx = j+x;
        if (ny<HEIGHT && ny>=0 && nx<WIDTH && nx>=0) {
          if (board[ny][nx][0] != 0 || board[ny][nx][2] != 0 || board[ny][nx][1] != 0) {
            l[0] += board[ny][nx][0];
            l[1] += board[ny][nx][1];
            l[2] += board[ny][nx][2];
            lll++;
            // break;
          }
        }
        l[0] = clamp(l[0]/lll-2,0,255);
        l[1] = clamp(l[1]/lll-2,0,255);
        l[2] = clamp(l[2]/lll-2,0,255);
      }
      newBoard[i].push(l);
      
    }
  }
  board = newBoard;
}
var counter = 0;
function loop() {
  if (++counter > FRAMES_PER_ADD) {
    counter = 0;
    addRandomColor(Math.floor(Math.random()*HEIGHT),Math.floor(Math.random()*WIDTH));
  }
  update();
  var imgData = ctx.createImageData(WIDTH, HEIGHT);
  var data = imgData.data;
  for (var i = 0;i<HEIGHT;i++) {
    for (var j = 0;j<WIDTH;j++) {
      const t = 4*(j+(i*WIDTH));
      const b = board[i][j];
      data[t] = b[0];data[t+1] = b[1];data[t+2] = b[2];data[t+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);