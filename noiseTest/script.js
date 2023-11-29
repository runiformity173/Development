const WIDTH = 512;
const HEIGHT = 320;
const overallLength = WIDTH*HEIGHT;
let board = [];
const clamp = (o,m1,m2)=>(Math.min(Math.max(o,m1),m2));
for (var i = 0;i<HEIGHT;i++) {
  board.push([]);
  for (var j = 0;j<WIDTH;j++) {
    board[i].push(clamp(perlin.get(j/20,i/20)/10+perlin.get(j/50,i/50)*0+perlin.get(j/200,i/200)+0.5,0,1));
  }
}
console.log(Math.max(...board.map((o)=>(Math.max(...o)))));
// board.board[0][2].type = 1;
// console.log(board.board)
const canvas = document.getElementById("output");
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext("2d");

var imgData = ctx.createImageData(WIDTH, HEIGHT);
var data = imgData.data;
for (var i = 0;i<HEIGHT;i++) {
  for (var j = 0;j<WIDTH;j++) {
    const t = 4*(j+(i*WIDTH));
    const b = board[i][j]*255;
    data[t] = b;data[t+1] = b;data[t+2] = b;data[t+3] = 255;
  }
}
ctx.putImageData(imgData, 0, 0);