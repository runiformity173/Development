const NAMES = ["Air","Sand","Water","Oil","Stone","Wood","Steam","Fire","Ash","Glass","Molten Glass","Plasma","Fuse","Spring","Gunpowder","Phase Dust","Plant","Methane","Soil"]
var swap = function (x){return x};
const CHUNK_AMOUNT = 16;
function getChunk(row,col) {
  return Math.floor(row/CHUNK_AMOUNT)*CHUNK_AMOUNT + Math.floor(col/CHUNK_AMOUNT);
}
function getChunkPos(row,col) {
  return [row%CHUNK_AMOUNT,col%CHUNK_AMOUNT];
}

class Particle {
  constructor() {
    this.heat = 0;
  }
  act() {
    this.stateAct();
    this.burnAct();
    this.otherAct();
  }
  burnAct() {console.log("no burning set");}
  otherAct() {console.log("no other set");}
}
function solid(Base) {
class Solid extends Base {
  constructor() {
   super();
  }
  stateAct() {
    console.log("I AM A SOLID");
  }
} return Solid;}

function burnable(Base) {
class Burnable extends Base {
  constructor() {
   super();
  }
  burnAct() {
    if (this.heat >= this.burnThreshold) {
      board.board[this.y][this.x] = new Fire(this);
    }
  }
} return Burnable;}

const creator = (allProperties, property) => property(allProperties);
const properties = function(...ps) {
  const temp = ps.reduce(creator, Particle);
  console.log(temp);
  return temp;
}