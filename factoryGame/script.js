const WIDTH = 20;
const HEIGHT = 20;
const MS_PER_TICK = 100;
let ticks = 0;
let BOARD = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},a=>(0)));
let INPUTS = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},a=>(0)));
let OUTPUTS = Array.from({length:HEIGHT},()=>Array.from({length:WIDTH},a=>(0)));
let TILES = [];
let USED = new Set();
function moveItems(id, item) {
  needed = item.amount;
  for (const slot of TILES[id].inventory) {
    if (slot.id === item.id && slot.amount < 24) {
      const used = Math.min(needed,24 - slot.amount);
      needed -= used;
      slot.amount += used;
      if (needed <= 0) {
        break;
      }
    }
  }
  if (needed === 0) return 0;
  for (const slot of TILES[id].inventory) {
    if (slot.id === undefined) {
      const used = Math.min(needed,24);
      needed -= used;
      slot.amount += used;
      slot.id = item.id;
      if (needed <= 0) {
        break;
      }
    }
  }
  return needed;
}
function removeItems(id, item) {
  needed = item.amount;
  for (const slot of TILES[id].inventory) {
    if (slot.id === item.id && slot.amount > 0) {
      const used = Math.min(needed,slot.amount);
      needed -= used;
      slot.amount -= used;
      if (slot.amount === 0) {
        slot.id = undefined;
      }
      if (needed <= 0) {
        break;
      }
    }
  }
  return needed
}
function hasItems(items, req) {
  const required = {};
  for (const item of req) {required[item.id]=item.amount;}
  for (const item of items) {
    if (required[item.id] !== undefined) {
      required[item.id] -= item.amount;
    }
  }
  return Math.max(Object.values(required)) <= 0;
}
function rotateArrayRight(arr){var newarr = [];for(var x = 0;x < arr[0].length;x++){newarr[x] = [];for(var y = arr.length - 1;y >= 0;y--){newarr[x].push(arr[y][x]);}} return newarr;}
function placeMachine(tile, y, x, rotation) {
  let shape = SHAPES[tile];
  for (let i = 0;i<rotation;i++) {shape = rotateArrayRight(shape);}
  for (let yo = 0;yo < shape.length;yo++) {
    for (let xo = 0;xo < shape[0].length;xo++) {
      if (!(y+yo < HEIGHT && x+xo < WIDTH && (BOARD[y+yo][x+xo]==0 || shape[yo][xo]==0))){
        return false;
      }
    }
  }
  let id = 0;
  for (var i = 2;i<USED.size+4;i++) {
    if (!USED.has(i)) {
      id = i;
      USED.add(id);
      break;
    }
  }
  TILES[id] = {x:x,y:y,rotation:rotation,tile:tile,id:id,inventory:[],current:-1,time:-1};
  for (let yo = 0;yo < shape.length;yo++) {
    for (let xo = 0;xo < shape[0].length;xo++) {
      const k = shape[yo][xo]
      if (k > 0) {
      BOARD[yo+y][xo+x] = id;
      if (k === 2 || k === 4) {
        INPUTS[yo+y][xo+x] = id;
      } if (k === 3 || k === 4) {
        OUTPUTS[yo+y][xo+x] = id;
        let [out_y,out_x] = [yo+y,xo+x];
        if (TILES[id].rotation === 0) {out_x += 1;}
        else if (TILES[id].rotation === 3) {out_y -= 1;}
        else if (TILES[id].rotation === 2) {out_x -= 1;}
        else {out_y += 1;}
        TILES[id].output = [out_y,out_x];
      }
      }
    }
  }
  if (TYPE[tile] == "machine") {for(var i=0;i<MACHINES[tile].slots;i++)TILES[id].inventory.push({id:undefined,amount:0})}
  else if (TYPE[tile] == "conveyor") {TILES[id].inventory.push({id:undefined,amount:0})}

}
placeMachine("smelter",1, 1, 1);
placeMachine("crafter",5, 4, 0);
placeMachine("basic_conveyor",4, 2, 1);
placeMachine("basic_conveyor",5, 2, 0);
placeMachine("basic_conveyor",5, 3, 0);
placeMachine("basic_conveyor",5, 7, 0);
moveItems(2,{id:"iron_ore",amount:24});
// alert(TILES);
function tick() {
  ticks++;
  for (const tile of TILES) {
    if (tile === undefined) {continue;}
    const tileType = TYPE[tile.tile];
    if (tileType === "machine") {
      if (tile.current > -1) {
        tile.time -= 1;
        if (tile.time == 0) {
          tile.buffer = MACHINES[tile.tile].recipes[tile.current].output;
          tile.time = -1;
          tile.current = -1;
        }
      }
      else {
        for (var i = 0;i<MACHINES[tile.tile].recipes.length;i++) {
          const recipe = MACHINES[tile.tile].recipes[i];
          if (hasItems(tile.inventory,recipe.inputs)) {
            tile.current = i;tile.time = recipe.craftingTime
            for (const item of recipe.inputs) removeItems(tile.id,item);
          }
        }
      }
      if (tile.buffer !== undefined) {
        let [out_y,out_x] = tile.output;
        if (out_y >= 0 && out_y < HEIGHT && out_x >= 0 && out_x < WIDTH) {
          tile.buffer = {id:tile.buffer.id,amount:moveItems(BOARD[out_y][out_x],tile.buffer)}
          if (tile.buffer.amount < 1) {tile.buffer = undefined;}
        }
      }
    }
    if (tileType === "conveyor") {
      if (tile.time > -1) {
        tile.time--;
        if (tile.time === 0) {
          let [out_y,out_x] = tile.output;
          if (out_y >= 0 && out_y < HEIGHT && out_x >= 0 && out_x < WIDTH && INPUTS[out_y][out_x]>1) {
            tile.inventory[0] = {id:tile.inventory[0].id,amount:moveItems(BOARD[out_y][out_x],tile.inventory[0])}
            if (tile.inventory[0].amount < 1) {tile.inventory[0].id = undefined;}
          }
          if (tile.inventory[0].id) tile.time = CONVEYORS[tile.tile].speed;
        }
      } else if (tile.inventory[0].id) tile.time = CONVEYORS[tile.tile].speed-1;
    }
  }
}
setInterval(function(){try{tick()}catch (e){alert(e.stack);}},MS_PER_TICK);
