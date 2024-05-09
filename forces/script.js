const G = 10;
class Thing {
  constructor(radius,mass,x,y,vx,vy,color,stationary=false) {
    this.radius = radius;
    this.mass = mass;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.stationary = stationary;
  }
  forces(objects) {
    for (const object of objects) {
      const distsqr = (this.x-object.x)**2 + (this.y-object.y)**2;
      if (distsqr == 0) {continue;}
      const f = G*(object.mass*this.mass/(distsqr));
      const dx = object.x-this.x;
      const dy = object.y-this.y;
      const dist = Math.sqrt(distsqr);
      this.vx += f*dx/dist/this.mass;
      this.vy += f*dy/dist/this.mass;
    }
  }
  step() {
    if (this.stationary) {return;}
    this.x += this.vx;
    this.y += this.vy;
  }
  // check(objects,ind) {
  //   for (const object of objects) {
  //     if (object.type !== 1) {continue}
  //     const distsqr = (this.x-object.x)**2 + (this.y-object.y)**2;
  //     if (distsqr === 0) {continue;}
  //     if (distsqr <= (this.radius + object.radius)**2) {
  //       toBeDeleted.push(ind);
  //     }
  //   }
  // }
}
let toBeDeleted = []
let objects = []
const SUN_MASS = 200;
function reset() {
  objects = [];
  // objects.push(new Thing(10,SUN_MASS,256,256,0,0,"#ffff00",stationary=true)); //Sun
  // objects.push(new Thing(3,1,256,384,-Math.sqrt(1*SUN_MASS*G/128),0,"#0000ff")); //Earth
  // objects.push(new Thing(1,0.1,256,390,-Math.sqrt(1*G/6)-Math.sqrt(1*SUN_MASS*G/128),0,"#bbbbbb")); //Moon
  // objects.push(new Thing(1,0.1,256,100,-Math.sqrt(1.7*SUN_MASS*G/156),0,"#bbbbff")); //Comet
  objects.push(new Thing(3,1,256,384,-Math.sqrt(1*SUN_MASS*G/128),0,"#0000ff")); //Earth
  objects.push(new Thing(3,1,256+Math.cos(2*Math.PI/3)*128,256-Math.sin(2*Math.PI/3)*128,Math.sqrt(1*SUN_MASS*G/128)*Math.sin(2*Math.PI/3),Math.sqrt(1*SUN_MASS*G/128)*-Math.sin(2*Math.PI/3),"#0000ff")); //Earth
  objects.push(new Thing(3,1,256+Math.cos(Math.PI/3)*128,256-Math.sin(Math.PI/3)*128,Math.sqrt(1*SUN_MASS*G/128)*Math.cos(Math.PI/3),Math.sqrt(1*SUN_MASS*G/128)*Math.sin(Math.PI/3),"#0000ff")); //Earth
  objects.push(new Thing(10,SUN_MASS,256,256,0,0,"#212529",stationary=true)); //Sun
  trackObject(tracking);


  // objects.push(new Thing(10,1000,128,128,0,0,"#000000",1));

}
function update() {
  for (let i = 0;i < objects.length;i++) {
    objects[i].forces(objects);
  }
  for (let i = 0;i < objects.length;i++) {
    objects[i].step();
  }
  // for (let i = 0;i < objects.length;i++) {
  //   objects[i].check(objects,i);
  // }
  for (let i = toBeDeleted.length-1;i !== -1;--i) {
    objects.splice(toBeDeleted[i],1,);
  }
  toBeDeleted = [];
}

// V-orbit = sqrt(GM/r)
// V-escape = sqrt(2GM/r)