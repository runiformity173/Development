// class Fire extends properties(gas) {
//   constructor(prev) {
//     super();
//     this.name = "Fire";
//     this.prev = prev.name;
//   }
// }
class Fuse extends properties(solid,burnable) {
  constructor() {
    super();
    this.name = "Fuse";
    this.burnThreshold = 10;
  }
}
const test = new Fuse();
console.log(test);
test.act();