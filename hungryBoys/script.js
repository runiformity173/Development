const choose = o=>o[Math.floor(Math.random()*o.length)];
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
  document.getElementById("playersStatus").innerHTML += `<p>${player.status}</p>`;
  }
}
function displayLogs(day2=-1) {
  for (player of players) {
    if (day2 === -1) {
      print(player.name);
      print("<span class='indented'><table>" + player.log.filter(o=>o.day>0).map(o=>`<tr><td>Day ${o.day}: </td><td>${o.log}</td></tr>`).join("").format(player) + "</table></span>");}
    else {
      if (player.dayDead < day2 && player.dayDead !== -1) {continue;}
      print(player.name);
      print("<span class='indented'><table>" + player.log.filter(o=>(o.day===day2)).map(o=>`<tr><td>Day ${o.day}: </td><td>${o.log}</td></tr>`).join("").format(player) + "</table></span>");
    }
  }
}
function addPlayers() {
  players = [];
  for (const element of document.getElementById("playerField").children) {
    if (element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.value != "Primary Ability" && element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value != "Secondary Ability" && element.firstElementChild.firstElementChild.nextElementSibling.value[0].toLowerCase() != "p") {
    let final = [0,0,0];
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.value]] += 4;
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value]] += 2;
    players.push(new Player(element.firstElementChild.firstElementChild.value,element.firstElementChild.firstElementChild.nextElementSibling.value[0].toLowerCase(),players.length,final));
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
    final.push({name:field.firstElementChild.firstElementChild.value,pronoun:field.firstElementChild.firstElementChild.nextElementSibling.value,primary:field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.value,secondary:field.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value,});
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
function load() {
  const name = prompt("What name to get? You have:\n"+JSON.parse(getCookie("list_of_saves")).join("\n"));
  const final = JSON.parse(getCookie(name));
  let n = 0;
  const k = document.getElementById("playerField");
  k.innerHTML = "";
  for (const field of final) document.getElementById('addPlayerButton').click();
  for (const field of final) {

    const f = k.children[n].firstElementChild.firstElementChild;
    console.log(f);
    f.value = field.name;
    f.nextElementSibling.value = field.pronoun;
    f.nextElementSibling.nextElementSibling.value = field.primary;
    f.nextElementSibling.nextElementSibling.nextElementSibling.value = field.secondary;
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
    document.getElementById("mainButton").innerHTML = "Begin!";
    document.getElementById("playerFieldWrapper").style.display = "none";
    document.getElementById("gamemakerActions").style.display = "inline-block";
    start();
  }
  } else {document.getElementById("mainButton").innerHTML = "Next Day";document.getElementById("badEventButton").innerHTML = "Cause Bad Event Tomorrow";day++;resolveDay();}
}

function gameOver(player) {
  print(player.name + " won!");
  document.getElementById("mainButton").innerHTML = "Start";
  document.getElementById("playerFieldWrapper").style.display = "inline-block";
  document.getElementById("gamemakerActions").style.display = "none";
  displayLogs();
}

// Gamemaker actions
function lowerMapSize() {
  document.getElementById("lowerMapSizeButton").innerHTML = `Lower Map Radius to ${--settings.mapRadius - 1}`;
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