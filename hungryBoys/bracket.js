const abilityScores = ["Strength","Dexterity","Intelligence"];
// const abilityScores = ["Intelligence"];
// Int Strength Swords Shelter
// another good one is Int Dex Shelter Archery/Knives
// Shelter Camouflage better when multiple people
LOGGING = false;
let stillIn = [];
let winners = [];
const names = new Set();
for (const primary of ["Intelligence","Strength"]) {
  for (const secondary of ["Dexterity"]) {
    for (const skill1 of backgroundSkills) {
      for (const skill2 of stationSkills) {
        if (skill1 === skill2) {continue;}
        if (names.has(primary[0]+secondary[0]+skill1[0]+skill2[skill2.length-4]+skill1[0]+skill1[skill1.length-4])) {continue;}
        stillIn.push({pronoun:"Generic",primary:primary,secondary:secondary,skills:[skill1,skill2],name:(primary[0]+secondary[0]+skill1[0]+skill1[skill1.length-4]+skill2[0]+skill2[skill2.length-4])});
        names.add(stillIn[stillIn.length-1].name);
      }
    }
  }
}
stillIn = shuffle(stillIn);
let i = 0;
let interval = 0;
let games = 0;
async function bracket(k=1) {
  if (stillIn.length == 1) {clearInterval(interval);console.log(stillIn);}
  for (;i<stillIn.length-3;i+=4) {
    load(true,[stillIn[i],stillIn[i+1],stillIn[i+2],stillIn[i+3]]);
    games++;
    const results = runGames2(2002)[0];
    let m=0;let mn="";
    for (const name in results) {
      if (results[name] > m) {m=results[name];mn=name;}
    }
    winners.push([stillIn[i],stillIn[i+1],stillIn[i+2],stillIn[i+3]].filter(o=>o.name==mn)[0]);
    if (i%(k*4) == 0) {i+=4;console.log(i);return i-4;}
  }
  if (stillIn.length&3) {
    const temp = [];
    for (let k = stillIn.length-1;k>=winners.length*4;k--) {
      temp.push(stillIn[k]);
    }
    winners.push(...temp);
  }
  console.log("done with " + stillIn.length);
  stillIn = shuffle(winners);
  winners = [];
  i = 0;
  console.log("new is " + stillIn.length);

}
async function runBracket() {
  const start = Date.now()
  await bracket();
  console.log(Date.now()-start);
  if (stillIn.length > 1) {setTimeout(runBracket,50);}
  else {console.log(stillIn[0]);}
}
async function compare(left,right) {
  load(true,[left,right]);
  const results = runGames2(1001);
  return (results[0][left.name]>results[0][right.name])?-1:1;
}

let j = sorted.length;
async function sort() {
  let min = 0;
  let max = sorted.length;
  let g = 0;
  //.splice(finalPos,0,item)
  while (min < max) {
    g += 1;
    const mid = Math.floor((min+max)/2)
    const t = await compare(stillIn[j],sorted[mid]) 
    if (t === -1) {
      max = mid;
    } else if (t === 1) {
      min = mid+1;
    }
    if (g == 10) {return;}
  }
  sorted.splice(min,0,stillIn[j])
  j += 1;
}
async function runSort() {
  const start = Date.now()
  await sort();
  print(j);
  console.log(Date.now()-start,sorted.length);
  if (stillIn.length > sorted.length) {setTimeout(runSort,50);}
}