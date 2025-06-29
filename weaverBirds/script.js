let TICKS_PER_SECOND = 10;
let TICKS_PER_DAY = 60*24;

const boards = [];
let displayIndex = 0;
const canvas = document.getElementById("boardOutput");
const ctx = canvas.getContext("2d");
const canvas2 = document.getElementById("output2");
const ctx2 = canvas.getContext("2d");
let mod = 0;
const birdCircles = {};
function tick() {
	mod = (mod+1)%(60/TICKS_PER_SECOND);
	if (mod !== 0) {
		requestAnimationFrame(tick);
		return;
	}
	const birdPositions = {};
	for (const board of boards) {
		if (board === boards[displayIndex])
			for (const bird of board.birds)
				birdPositions[bird.uuid] = [bird.x,bird.y];
		board.tick();
	}
	if (boards[displayIndex]) {
		ctx.clearRect(0,0,512,512);
		const board = boards[displayIndex];
		const PIXEL = 512/board.size;
		ctx.lineWidth = 2;
		ctx.strokeStyle = "black";
		ctx.fillStyle = "#0000ff";
		for (let i = 0;i<board.size;i++) {
			for (let j = 0;j<board.size;j++) {
				if (i === board.waterPos[1] && j === board.waterPos[0]) ctx.fillRect(PIXEL*j,PIXEL*i,PIXEL,PIXEL);
				ctx.strokeRect(PIXEL*j,PIXEL*i,PIXEL,PIXEL);
			}
		}
		for (const bird of board.birds) {
			if (!(bird.uuid in birdCircles)) {
				birdPositions[bird.uuid] = boards[displayIndex].colonyPos;
				const a = document.createElement("div");
				a.classList.add("bird");
				a.classList.add("male-bird");
				canvas.parentElement.appendChild(a);
				birdCircles[bird.uuid] = a;
			}
			birdCircles[bird.uuid].style.left = (canvas.clientWidth/board.size)*bird.x+"px";
			birdCircles[bird.uuid].style.top = (canvas.clientHeight/board.size)*bird.y+"px";
			birdCircles[bird.uuid].animate([
				{left: `${birdPositions[bird.uuid][0]*(canvas.clientWidth/board.size)}px`, top:`${birdPositions[bird.uuid][1]*(canvas.clientHeight/board.size)}px`},
				{left: `${bird.x*(canvas.clientWidth/board.size)}px`, top:`${bird.y*(canvas.clientHeight/board.size)}px`}
			], {duration: 1000/TICKS_PER_SECOND, easing: "ease-in-out", fill: "forwards"});
		}
 	}
	requestAnimationFrame(tick);
}
// tick()
function addBoard() {
	boards.push(new Board(7,3,3,0,6,[new MaleWeaverbird(3,3),new MaleWeaverbird(3,3),new FemaleWeaverbird(3,3)]));
}