class Board {
	constructor(size,colonyX,colonyY,waterX,waterY,birds) {
		this.board = Array.from({length:size}).map(o=>Array.from({length:size}).map(z=>{}));
		this.size = size;
		this.waterPos = [waterX,waterY];
		this.colonyPos = [colonyX,colonyY];
		this.birds = birds;
		this.nests = [];
	}
	tick() {
		for (const bird of this.birds) {
			bird.tick(this);
		}
		// code for materials blowing away
	}
}