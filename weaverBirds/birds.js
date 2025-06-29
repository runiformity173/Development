// African Village Weaverbird
// Specifically PLOCEUS CUCULLATUS CUCULLATUS
const NEEDS_THRESHOLD = 10;
const CARRYING_CAPACITY = 1;
const MAX_DISPLAY_ATTEMPTS = 50;
function getUUID(){return"10000000-1000-4000-8000-100000000000".replace(/[018]/g,t=>(+t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>+t/4).toString(16))}
class Weaverbird {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.uuid = getUUID();
		this.hunger = 100;
		this.thirst = 100;
		this.nest = null;
		this.goal = "";
		this.age = 0;
		this.cargo = [];
	}
	findFood(board) {
		if (this.x === board.waterPos[0] && this.y === board.waterPos[1]) {
			this.moveRandomly(board);
		} else if (this.x === board.colonyPos[0] && this.y === board.colonyPos[1]) {
			this.moveRandomly(board);
		} else {
			this.hunger += 15;
		}
	}
	findWater(board) {
		if (this.x === board.waterPos[0] && this.y === board.waterPos[1]) {
			this.thirst = 100;
		} else this.goTo(...board.waterPos);
	}
	findMaterials(board) {
		if (this.x === board.waterPos[0] && this.y === board.waterPos[1]) {
			this.moveRandomly(board);
		} else if (this.x === board.colonyPos[0] && this.y === board.colonyPos[1]) {
			this.moveRandomly(board);
		} else {
			this.cargo.push(this.desiredMaterials());
		}
	}
	build(board) {
		if (this.x === board.colonyPos[0] && this.y === board.colonyPos[1]) {
			if (this.nest) {
				this.nest.add(this.cargo);
			} else {
				this.nest = new Nest(this);
				const rIndex = Math.floor(Math.random()*board.nests.length);
				if (board.nests.length > 0 && board.nests[rIndex].stage === -1) {
					delete board.nests[rIndex];
					board.nests[rIndex] = this.nest;
				}
				else board.nests.push(this.nest);
				this.nest.add(this.cargo);
			}
			this.cargo = [];
			this.nest.updateCompleteness();
		} else this.goTo(...board.colonyPos);
	}
	tick(board) {
		switch (this.goal) {
			case "drink":
				this.findWater(board);
				break;
			case "eat":
				this.findFood(board);
				break;
			case "materials":
				this.findMaterials(board);
				break;
			case "build":
				this.build(board);
				break;
			case "display":
				this.display(board);
				break;
			case "rest":
				break;
			case "survey":
				this.survey(board);
				break;
			case "lay":
				this.nest.layEggs();
				break;
			case "incubate":
				break;
			default:
				console.log(this.goal,"not found");
				break;
		}
		this.endTick();
	}
	endTick() {
		this.hunger--;
		this.thirst--;
		this.age++;
		this.updateGoal();
		// console.log(this.hunger,this.thirst,this.goal);
	}
	goTo(targetX, targetY) {
		let dx = targetX-this.x;
		let dy = targetY-this.y;
		if (Math.abs(dx) == Math.abs(dy)) {
			if (Math.random() > 0.5) dx = 0;
			else dy = 0;
		}
		if (Math.abs(dx) > Math.abs(dy)) {
			if (dx > 0) this.x += 1;
			else this.x -= 1;
		} else {
			if (dy > 0) this.y += 1;
			else this.y -= 1;
		}
	}
	moveRandomly(board) {
		const options = [];
		if (this.y < board.size-1) options.push([this.x,this.y+1]);
		if (this.x < board.size-1) options.push([this.x+1,this.y]);
		if (this.y > 0) options.push([this.x,this.y-1]);
		if (this.x > 0) options.push([this.x-1,this.y]);
		[this.x,this.y] = options[Math.floor(Math.random()*options.length)];
	}
}
class MaleWeaverbird extends Weaverbird {
	constructor(x, y) {
		super(x, y);
		this.goal = "materials";
	}
	updateGoal() {
		if (this.hunger < NEEDS_THRESHOLD || this.thirst < NEEDS_THRESHOLD*2 || this.hunger+this.thirst < NEEDS_THRESHOLD*3) {
			if (this.thirst <= this.hunger)
				this.goal = "drink";
			else
				this.goal = "eat";
		} else if (Math.random() < 0.02) {
			this.goal = "rest";
		} else if (this.cargo.length == CARRYING_CAPACITY) {
			this.goal = "build";
		} else if (this.nest?.stage == 1 && !this.nest?.female) {
			this.goal = "display";
		} else {
			this.goal = "materials";
		}
	}
	desiredMaterials() {
		return "long strips";
	}
	display(board) {
		if (this.x !== board.colonyPos[0] || this.y !== board.colonyPos[1]) {
			this.goTo(...board.colonyPos);
		} else if (this.nest.displayAttempts > MAX_DISPLAY_ATTEMPTS) {
			this.nest = null;
		} else this.nest.displayAttempts++;
	}
}
const LINING_MATERIALS = []; // 226 grass leaves, 312 grass heads, 31 Dicot leaves, 72 grass strips, 1/8 cup of plant down (32 loads)
for (let i = 0;i<226;i++) LINING_MATERIALS.push("grass leaves");
for (let i = 0;i<312;i++) LINING_MATERIALS.push("grass heads");
for (let i = 0;i<31;i++) LINING_MATERIALS.push("dicot leaves");
for (let i = 0;i<72;i++) LINING_MATERIALS.push("grass strips");
for (let i = 0;i<32;i++) LINING_MATERIALS.push("plant down");
class FemaleWeaverbird extends Weaverbird {
	constructor(x, y) {
		super(x, y);
		this.goal = "survey";
	}
	updateGoal() {
		if (this.hunger < NEEDS_THRESHOLD || this.thirst < NEEDS_THRESHOLD*2 || this.hunger+this.thirst < NEEDS_THRESHOLD*3) {
			if (this.thirst <= this.hunger)
				this.goal = "drink";
			else
				this.goal = "eat";
		} else if (Math.random() < 0.02) {
			this.goal = "rest";
		} else if (this.cargo.length == CARRYING_CAPACITY) {
			if (this.nest?.stage == 4) this.goal = "feed";
			else this.goal = "build";
		} else if (this.nest?.stage == 2) {
			this.goal = "lay";
		} else if (this.nest?.stage == 3) {
			this.goal = "incubate";
		} else if (this.nest?.stage == 4 || this.nest?.stage == 1) {
			this.goal = "materials";
		} else {
			this.goal = "survey";
		}
	}
	desiredMaterials() {
		if (this.nest.stage == 1) {
			return LINING_MATERIALS[Math.floor(Math.random()*LINING_MATERIALS.length)];
		} else {
			return "food";
		}
	}
	survey(board) {
		if (this.x !== board.colonyPos[0] || this.y !== board.colonyPos[1]) {
			this.goTo(...board.colonyPos);
		} else {
			const availableNests = [];
			for (const nest of board.nests)
				if (nest.stage == 1)
					availableNests.push(nest);
			if (availableNests.length) {
				const nest = availableNests[Math.floor(Math.random()*availableNests.length)];
				nest.female = this;
				this.nest = nest;
			}
		}
	}
	tick(board) {
		super.tick(board);
		if (this.nest && this.nest.stage > 2) this.nest.ticks++;
	}
}