const PIXEL = document.getElementsByTagName("html")[0].clientHeight/WIDTH;
let frames = 0;
setInterval(function(){document.getElementById("fps").innerHTML = frames;frames = 0;document.getElementById("tps").innerHTML = ticks;ticks = 0;},1000);
function loop() {
  try {
  for (const tile of TILES) {
    if (tile === undefined) {continue}
    let out = document.getElementById(tile.id);
    if (out === null) {
      out = document.createElement("img");
      out.classList.add("tile");
      out.id = tile.id;
      out.draggable = false;
      document.getElementById("output").appendChild(out);
    }
    if (!out.src.includes(tile.tile+".svg")) {
      out.src = "images/"+tile.tile+".svg";
      let shape = SHAPES[tile.tile];
      for (let i = 0;i<tile.rotation;i++) {shape = rotateArrayRight(shape);}
      out.style.width = PIXEL*shape[0].length + "px";
      out.style.height = PIXEL*shape.length + "px";
      out.style.left = PIXEL*tile.x + "px";
      out.style.top = PIXEL*tile.y + "px";
      out.style.transform = "rotate("+90*tile.rotation+"deg)"
    }
    if (tile.inventory[0].id !== undefined) {
      out.classList.add("has-items");
    } else {
      out.classList.remove("has-items");
    }
  }} catch (e) {console.log(e.stack);}
  frames++;
  requestAnimationFrame(loop);
}
document.getElementById("output").addEventListener("click",function(event){
  const y = Math.floor(event.y/PIXEL);
  const x = Math.floor(event.x/PIXEL);
  alert(JSON.stringify(TILES[BOARD[y][x]]))
})
requestAnimationFrame(loop);