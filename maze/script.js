const MAZE_WIDTH = 64;
const MAZE_HEIGHT = 64;
const overallMazeLength = MAZE_WIDTH*MAZE_HEIGHT;


const WIDTH = MAZE_WIDTH*2 + 1;
const HEIGHT = MAZE_HEIGHT*2 + 1;
const overallLength = WIDTH*HEIGHT;


function shuffle(t){let f=t.length,n;for(;0!=f;)n=Math.floor(Math.random()*f),f--,[t[f],t[n]]=[t[n],t[f]];return t}

const fullGraph = [
  
]
const graph = [
  
]
const contained = new Set();
contained.add(0);
for (var i = 0;i < MAZE_HEIGHT;i++) {
  for (var j = 0;j < MAZE_WIDTH;j++) {
    graph.push([]);
    const edges = [];
    pos = i*MAZE_WIDTH + j;
    if (i > 0) {
      edges.push(pos-MAZE_WIDTH);
    } if (i < MAZE_HEIGHT-1) {
      edges.push(pos+MAZE_WIDTH);
    } if (j > 0) {
      edges.push(pos-1);
    } if (j < MAZE_WIDTH-1) {
      edges.push(pos+1);
    }
    fullGraph.push(edges);
    for (const k of edges) {
      allEdges.push([pos,k]);
    }
  }
}
while (contained.size < overallMazeLength) {
  shuffle(allEdges);
  for (var i = 0; i < allEdges.length; i++) {
    const [from,to] = allEdges[i];
    if (contained.has(from) != contained.has(to)) {
      contained.add(from);
      contained.add(to);
      graph[from].push(to);
      graph[to].push(from);
    }
  }
}
maze = [[0,0]];
for (var i = 2;i < WIDTH;i++) {maze[0].push(1);}
for (var i = 1;i < HEIGHT-1;i++) {
  maze.push([])
  if (i&1) {
    maze[i].push(1);
    for (var j = 0;j < MAZE_WIDTH-1;j++) {
      maze[i].push(0);
      const pos = (i-1)/2*MAZE_WIDTH + j;
      if (graph[pos].includes(pos+1)) {
        maze[i].push(0);
      } else {maze[i].push(1);}
    }
    maze[i].push(0);
    maze[i].push(1);
  }
  else {
    maze[i].push(1);
    for (var j = 0;j < MAZE_WIDTH;j++) {
      const pos = (i-2)/2*MAZE_WIDTH + j;
      if (graph[pos].includes(pos+MAZE_WIDTH)) {
        maze[i].push(0);
      } else {
        maze[i].push(1);
      }
      maze[i].push(1);
    }
  }
}
maze.push([]);
for (var i = 0;i < WIDTH-2;i++) {maze[HEIGHT-1].push(1);}
maze[HEIGHT-1].push(0);maze[HEIGHT-1].push(0);
maze[1][0] = 0;maze[HEIGHT-2][WIDTH-1] = 0;
console.log(maze);
// const k = Math.floor(Math.random()*1000)+1000;
// alert(k**2);
// alert(k);