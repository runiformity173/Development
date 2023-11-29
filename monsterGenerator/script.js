const choose=o=>o[Math.floor(Math.random()*o.length)];
function parseRolls(text) {
  let mathRegex = /\d+d\d+\s*\+*\s*\d*/g;
  let matches = text.match(mathRegex);
  let final = text;
  if (matches!==null) {
    for (let i = 0;i < matches.length; i++) {
      let t = matches[i].split("+");
      t.push("0");
      let new1 = [];
      t.forEach(function(d){new1.push(d.replace(" ",""))});
      t = roll(new1[0])+Number(new1[1]);
      if (matches[i].slice(-1)==" ") {
        t+=" ";
      }
      final = final.replace(matches[i],t);
    }}
  return final;
}
function roll(die) {
  if (die==0) {return 0}
  if (typeof(die)=="number"){return Math.floor(Math.random() * die) + 1}
  else{
    let t = die.split("d");
  let rolls = Number(t[0]);
    let q = t[1].includes("+")?t[1].split("+"):[t[1],0];
  let f = Number(q[0])
  let final = 0;
  for (let i = 0; i < rolls; i++) {
    final += roll(f);
  }
    return final+Number(q[1]);
  }
}
function reEvaluate(a) {
  if (a === "Dragon") {
    document.getElementById("dragonAge").style.opacity = 1.0;
    document.getElementById("dragonType").style.opacity = 1.0;
    document.getElementById("dragonAge").disabled = false;
    document.getElementById("dragonType").disabled = false;
  } else {
    document.getElementById("dragonAge").style.opacity = 0.0;
    document.getElementById("dragonType").style.opacity = 0.0;
    document.getElementById("dragonAge").disabled = true;
    document.getElementById("dragonType").disabled = true;
  }
}
function generate() {
  const dragonType = document.getElementById("dragonType").value != "Random"?document.getElementById("dragonType").value:choose(["Amethyst","Black","Blue","Brass","Bronze","Copper","Crystal","Deep","Emerald","Gold","Green","Moonstone","Red","Sapphire","Shadow","Silver","Topaz","Turtle","White"]);
  const dragonAge = document.getElementById("dragonAge").value!="Random"?document.getElementById("dragonAge").value:choose(["Wyrmling","Young","Adult","Ancient"]);
  document.getElementById("output").innerHTML = choose(data[dragonType.toLowerCase()]["connections"+(dragonType==="Faerie"?"":dragonAge)]);
}