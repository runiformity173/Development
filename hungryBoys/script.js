const choose = o=>o[Math.floor(Math.random()*o.length)];
let LOGGING = true;
String.prototype.format = function() {
  const player = arguments[0];
  const animal = arguments[1]||choose(data.animals);
  let final = this.replaceAll("{name}",player.nameDisplay).replaceAll("{object}",player.pronouns.object).replaceAll("{possessive}",player.pronouns.possessive).replaceAll("{subject}",player.pronouns.subject).replaceAll("{animal}",animal);
  let capIndex;
  // {cap} for next letter capital
  while ((capIndex=final.indexOf("{cap}")) >= 0) {
    final = final.replace("{cap}","");
    final = final.substring(0, capIndex) + final[capIndex].toUpperCase() + final.substring(capIndex + 1);
  }
  // {a} for a/an
  // let w = "";
  // while ((w=final.indexOf("{a}")) >= 0) {
  //   if (["a","e","i","o","u"].includes(final[w+4])) {
  //     final = final.replace("{a}","an");
  //   } else {final = final.replace("{a}","a");}
  // }
  return final;
}
Object.defineProperty(Object.prototype, 'print', {value: function() {for (const a of this) {print(a);}}});
function listFormat(list) {
  if (list.length == 0) return false;
  if (list.length == 1) return list[0];
  if (list.length == 2) return `${list[0]} and ${list[1]}`;
  if (list.length > 2) return (list.filter((o,i)=>(i!=list.length-1)).join(", "))+ ", and "+list[list.length-1];

}
function print(a) {
  const added = document.createElement("span");
  added.innerHTML = a;
  document.getElementById("output").appendChild(added);
  document.getElementById("output").appendChild(document.createElement("br"));
}

function clear() {
  document.getElementById("output").innerHTML = "";
}
function modal(string) {
  alert(string);
}
function updateStatus() {
  document.getElementById("playersStatus").innerHTML = "";
  for (player of players) {
  document.getElementById("playersStatus").innerHTML += `<div>${player.status}</div>`;
  }
}
function displayLogs(day2=-1) {
  if (!LOGGING) {return;}
  let string = "";
  string += ("<div id='logs'>");
  for (player of players) {
    if (day2 === -1) {
      string += ("<span class='playerLog'>");
      string += (player.name+"<br>");
      string += ("<table>" + player.log.filter(o=>o.day>0).map(o=>`<tr><td>Day ${o.day}: &emsp;</td><td>${o.log}</td></tr>`).join("").format(player) + "</table></span>");
    }
    else {
      if (player.dayDead < day2 && player.dayDead !== -1) {continue;}
      string += ("<span class='playerLog'>");
      string += (player.name+"<br>");
      string += ("<table>" + player.log.filter(o=>(o.day===day2)).map(o=>`<tr><td>Day ${o.day}: &emsp;</td><td>${o.log}</td></tr>`).join("").format(player) + "</table></span>");
    }
  }
  string += ("</div>");
    document.getElementById("output").innerHTML += (string);
}
function addPlayers() {
  players = [];
  for (const element of document.getElementById("playerField").children) {
    const f = element.firstElementChild.firstElementChild.nextElementSibling;
    if (f.nextElementSibling.value != "Primary Ability" && f.nextElementSibling.nextElementSibling.value != "Secondary Ability" && f.value[0].toLowerCase() != "p" && f.nextElementSibling.nextElementSibling.nextElementSibling.value != "Background Skill" && f.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value != "Pre-Games Station") {
    let final = [0,0,0];
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[f.nextElementSibling.value]] += 4;
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[f.nextElementSibling.nextElementSibling.value]] += 2;
      final[2] = final[2]/2 + 1;
    players.push(new Player(element.firstElementChild.firstElementChild.value,f.value[0].toLowerCase(),players.length,final,[f.nextElementSibling.nextElementSibling.nextElementSibling.value,f.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value]));
    } else {
      alert("Please select something for every field.");
      return false;
    }
  }
  aliveNumber = players.length;
  return true;
}
function setCookie(name,value) {
  const prev = JSON.parse(localStorage.getItem("hungerGames") || "{}");
  prev[name] = value;
  localStorage.setItem("hungerGames", JSON.stringify(prev));
}
function getCookie(name) {
  return JSON.parse(localStorage.getItem("hungerGames") || "{}")[name] || "[]";
}
if (getCookie("default").length !== JSON.stringify(DEFAULT_SETUP).length) {
  setCookie("default",JSON.stringify(DEFAULT_SETUP));
  const w = JSON.parse(getCookie("list_of_saves")) || [];
  if (!w.includes("default")) w.push("default");
  setCookie("list_of_saves",JSON.stringify(w));
}
function eraseCookie(name) {   
  const prev = JSON.parse(localStorage.getItem("hungerGames"));
  if (name in prev) delete prev[name];
  localStorage.setItem("hungerGames", JSON.stringify(prev));
}
function save() {
  const name = prompt("What name to save as?");
  const final = [];
  let playerN = 0;
  for (const field of document.getElementById("playerField").children) {
    playerN++
    final.push({name:field.firstElementChild.firstElementChild.value,pronoun:field.firstElementChild.firstElementChild.nextElementSibling.value,primary:field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.value,secondary:field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value,skills:[field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value,field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value]});
  }
  setCookie(name,JSON.stringify(final));
  const w = JSON.parse(getCookie("list_of_saves")) || [];
  if (!w.includes(name)) w.push(name);
  setCookie("list_of_saves",JSON.stringify(w));
}
function erase() {
  const name = prompt("What name to erase? You have:\n"+JSON.parse(getCookie("list_of_saves")).join("\n"));
  eraseCookie(name);
  const w = JSON.parse(getCookie("list_of_saves"));
  if (w.includes(name)) {
    w.splice(w.indexOf(name),1);
    setCookie("list_of_saves",JSON.stringify(w));
  }
}
function load(test=false,data=false) {
  let final;
  if (!test) {
  const name = prompt("What name to get? You have:\n"+JSON.parse(getCookie("list_of_saves")).join("\n"));
  final = JSON.parse(getCookie(name));}
  else {
    final = data?data:ABILITY_SCORE_TEST;
  }
  let n = 0;
  const k = document.getElementById("playerField");
  k.innerHTML = "";
  for (const field of final) document.getElementById('addPlayerButton').click();
  for (const field of final) {

    const f = k.children[n].firstElementChild.firstElementChild;
    f.value = field.name;
    f.nextElementSibling.value = field.pronoun;
    f.nextElementSibling.nextElementSibling.value = field.primary;
    f.nextElementSibling.nextElementSibling.nextElementSibling.value = field.secondary;
    f.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value = field.skills[0];
    f.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value = field.skills[1];
    n++;
  }
}
function start() {
  if (document.getElementById("mainButton").innerHTML == "Start") {
    clear();
    if (addPlayers()) {
    if (players.length < 2) {
      alert("You need at least 2 players to play.")
      return false;
    }
    day = 0;
    settings.mapRadius = 8;
    document.getElementById("lowerMapSizeButton").innerHTML = `Lower Map Radius to ${settings.mapRadius - 1}`;
      document.getElementById("lowerMapSizeButton").disabled = false;
    document.getElementById("mainButton").innerHTML = "Begin!";
    document.getElementById("playerFieldWrapper").style.display = "none";
    document.getElementById("gamemakerActions").style.display = "inline-block";
    start();
  }
  } else {document.getElementById("mainButton").innerHTML = "Next Day";document.getElementById("badEventButton").innerHTML = "Cause Bad Event Tomorrow";day++;resolveDay();}
}

function gameOver(player,died=false) {
  print("<center><h1 class='text-light'>"+player.name + " won!</h1></center>");
  document.getElementById("mainButton").innerHTML = "Start";
  document.getElementById("playerFieldWrapper").style.display = "inline-block";
  document.getElementById("gamemakerActions").style.display = "none";
  if (died) {
    player.log.pop();
    player.log.push({day:day,log:(player.__deathMessage in almostDeathMessages?almostDeathMessages[player.__deathMessage]:`{name} is almost killed by ${player.__deathMessage.player} with ${player.__deathMessage.weapon}`)+", but is pulled out of the arena as the victor"});
  }
  displayLogs();
}
// Gamemaker actions
function lowerMapSize() {
  --settings.mapRadius;
  if (settings.mapRadius>1) {
    document.getElementById("lowerMapSizeButton").innerHTML = `Lower Map Radius to ${settings.mapRadius - 1}`;
  }
  else {
    document.getElementById("lowerMapSizeButton").innerHTML = `Map Radius already at 1`;
    document.getElementById("lowerMapSizeButton").disabled = true;
  }
  for (player of players) {
    (player.health > 0) && (player.distance = Math.min(player.distance,settings.mapRadius));
  }
}
function badEvent() {
  if (BAD_EVENT === false) {
    BAD_EVENT = Math.floor(Math.random()*data.randomEvents.length);
    document.getElementById("badEventButton").innerHTML = "Cancel Bad Event";
  } else {
    BAD_EVENT = false;
    document.getElementById("badEventButton").innerHTML = "Cause Bad Event Tomorrow";
  }
}

function runGames2(amount = 100,wins={},weapons={},kills={},deathCauses={}) {
  if (document.getElementById("mainButton").innerHTML == "Start") start();
  if (Object.keys(wins).length == 0) {
    for (const p of players) {
      deathCauses[p.name] = {};wins[p.name] = 0;kills[p.name] = 0;weapons[p.name] = {};
    }
  }
  for (let game = 0;game < amount;game++){
    if (document.getElementById("mainButton").innerHTML == "Start") start();
    let r = 0;
    while (document.getElementById("mainButton").innerHTML == "Next Day") {
      
      start();
      if (++r == 10) {
        for (let i = 0;i<7;i++) lowerMapSize();
      }
      else if (r >= 20) {
        badEvent();
      }
    }
    let winner = document.querySelector("h1").innerHTML.replace(" won!","");
    wins[winner]++
    for (const p of players) {
      kills[p.name] += p.kills.length;
      for (const w of p.kills) {
        if (w in weapons[p.name]) {
          weapons[p.name][w]++
        } else {weapons[p.name][w] = 1;}
      }
      for (const damageType in p.damages) {
        if (!(damageType in deathCauses[p.name])) {deathCauses[p.name][damageType] = 0;}
        deathCauses[p.name][damageType] += p.damages[damageType];
      }
    }
  }
  return [wins,weapons,kills,deathCauses];
}
window.addEventListener("keydown", function (e){
  if (e.key == "π") {
    eval(prompt("what do you want to run?","runGames(100)"));
  }
})

const data1 = {"II":749,"DI":308,"IS":522,"ID":545,"SI":315,"DD":68,"SD":42,"SS":90,"DS":61};

async function runGames(amount=10000) {
  let deathCauses={},wins={},kills={},weapons={};
  for (let i = 0;i<amount;i+=1000) {
    [wins,weapons,kills,deathCauses] = runGames2(Math.min(1000,amount-i),wins,weapons,kills,deathCauses);
  }
  console.log("wins:",wins);
  console.log("kills:",kills);
  console.log("kill weapons:",weapons);
  const t = structuredClone(deathCauses);
  console.log("damage taken:",t);
  for (var key in deathCauses) {
    if (deathCauses.hasOwnProperty(key)) {
      for (var key2 in deathCauses[key]) {
        if (deathCauses[key].hasOwnProperty(key2)) {
          deathCauses[key][key2] /= amount;
        }
      }
    }
  }
  console.log("average damage taken:",deathCauses);
}
