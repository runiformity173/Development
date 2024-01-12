let DIFFUSION_A = 1.0;
let DIFFUSION_B = 0.5;
let FEED_A = 0.055;
let KILL_B = 0.062;
let DELTA_TIME = 1.0;

const WIDTH = 256;
const HEIGHT = 256;
const overallLength = WIDTH*HEIGHT;
const laplaceCorner = 0.104;
const laplaceEdge = 0.146;

let chemA = new Float32Array(overallLength);
let chemB = new Float32Array(overallLength);
let newChemA = new Float32Array(overallLength);
let newChemB = new Float32Array(overallLength);

const clamp = o=>Math.max(0,Math.min(1,o));
function start() {
  for (let i = 0;i<overallLength;i++) {
    chemA[i] = 1.0;
    chemB[i] = 0.0;
  }
}

function update() {

  for (let y = 0;y<HEIGHT;y++) {
    for (let x = 0;x<WIDTH;x++) {
      const a = chemA[y*WIDTH + x];
      const b = chemB[y*WIDTH + x];
      let laplaceA = -a;
      if (y > 0 && x > 0) {
        laplaceA += laplaceCorner*chemA[(y-1)*WIDTH + x-1];
      } if (y > 0) {
        laplaceA += laplaceEdge*chemA[(y-1)*WIDTH + x];
      } if (y > 0 && x < WIDTH-1) {
        laplaceA += laplaceCorner*chemA[(y-1)*WIDTH + x+1];
      } if (x > 0) {
        laplaceA += laplaceEdge*chemA[y*WIDTH + x-1];
      } if (x < WIDTH-1) {
        laplaceA += laplaceEdge*chemA[y*WIDTH + x+1];
      } if (y < HEIGHT-1 && x > 0) {
        laplaceA += laplaceCorner*chemA[(y+1)*WIDTH + x-1];
      } if (y < HEIGHT-1) {
        laplaceA += laplaceEdge*chemA[(y+1)*WIDTH + x];
      } if (y < HEIGHT-1 && x < WIDTH-1) {
        laplaceA += laplaceCorner*chemA[(y+1)*WIDTH + x+1];
      }
      let laplaceB = -b;
      if (y > 0 && x > 0) {
        laplaceB += laplaceCorner*chemB[(y-1)*WIDTH + x-1];
      } if (y > 0) {
        laplaceB += laplaceEdge*chemB[(y-1)*WIDTH + x];
      } if (y > 0 && x < WIDTH-1) {
        laplaceB += laplaceCorner*chemB[(y-1)*WIDTH + x+1];
      } if (x > 0) {
        laplaceB += laplaceEdge*chemB[y*WIDTH + x-1];
      } if (x < WIDTH-1) {
        laplaceB += laplaceEdge*chemB[y*WIDTH + x+1];
      } if (y < HEIGHT-1 && x > 0) {
        laplaceB += laplaceCorner*chemB[(y+1)*WIDTH + x-1];
      } if (y < HEIGHT-1) {
        laplaceB += laplaceEdge*chemB[(y+1)*WIDTH + x];
      } if (y < HEIGHT-1 && x < WIDTH-1) {
        laplaceB += laplaceCorner*chemB[(y+1)*WIDTH + x+1];
      }
      newChemA[y*WIDTH + x] = clamp(a + (DIFFUSION_A*laplaceA-a*b*b+FEED_A*(1-a))*DELTA_TIME);
      newChemB[y*WIDTH + x] = clamp(b + (DIFFUSION_B*laplaceB+a*b*b-(KILL_B+FEED_A)*b)*DELTA_TIME);

    }
  }
  const tempA = newChemA;
  newChemA = chemA;
  chemA = tempA;
  const tempB = newChemB;
  newChemB = chemB;
  chemB = tempB;
}