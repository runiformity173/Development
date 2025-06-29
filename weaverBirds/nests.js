// https://digitalcommons.usf.edu/cgi/viewcontent.cgi?article=19149&context=auk
// 212 strips for a nonbrood nest, 258 for a brood one 
// 226 grass leaves, 312 grass heads, 31 Dicot leaves, 72 grass strips, 1/8 cup of plant down (32 loads)
class Nest {
	constructor(male) {
		this.male = male;
		male.nest = this;
		this.female = null;
		this.composition = {};
		this.displayAttempts = 0;
		this.stage = 0; // 1 is maleComplete, 2 is femaleComplete, 3 is eggs, 4 is chicks, -1 is empty
		this.ticks = 0;
		this.offspring = 0;
	}
	updateCompleteness() {
		if (this.stage > 2) return;
		if (this.composition["long strips"] >= 212) this.stage = 1;
		if (
			this.composition["grass leaves"] >= 190 &&
			this.composition["grass heads"] >= 250 &&
			this.composition["dicot leaves"] >= 25 &&
			this.composition["grass strips"] >= 60 &&
			this.composition["plant down"] >= 26
		) this.stage = 2;
	}
	layEggs() {
		this.stage = 3;
		this.offspring = 2 + +(Math.random() < 0.5) + +(Math.random() < 0.5);
	}
	add(cargo) {
		for (const item of cargo) {
			if (item in this.composition) this.composition[item]++;
			else this.composition[item] = 1;
		}
	}
	tick(board) {
		this.ticks++;
		if (this.stage == 3 && this.ticks >= TICKS_PER_DAY*12) {
			this.stage = 4;
			this.ticks = 0;
			console.log("they hatched");
		} else if (this.stage == 4 && this.ticks >= TICKS_PER_DAY*22) {
			this.stage = -1;
			this.female.nest = null;
			console.log("they grew up");
			this.female.cargo.clear();
		}
	}
}