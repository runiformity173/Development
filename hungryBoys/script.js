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
      print("<span class='indented'>" + player.log.filter(o=>o.day>0).map(o=>`Day ${o.day}: ${o.log}`).join("<br>").format(player) + "</span>");}
    else {
      if (player.dayDead < day2 && player.dayDead !== -1) {continue;}
      print(player.name);
      print("<span class='indented'>" + player.log.filter(o=>(o.day===day2)).map(o=>`Day ${o.day}: ${o.log}`).join("<br>").format(player) + "</span>");
    }
  }
}
function addPlayers() {
  players = [];
  for (const element of document.getElementById("playerField").children) {
    let final = [0,0,0];
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.value]] += 4;
    final[{"Intelligence":2,"Strength":1,"Dexterity":0}[element.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value]] += 2;
    players.push(new Player(element.firstElementChild.firstElementChild.value,element.firstElementChild.firstElementChild.nextElementSibling.value[0].toLowerCase(),players.length,final));
  }
  aliveNumber = players.length;
}
function start() {
  if (document.getElementById("mainButton").innerHTML == "Start") {
    clear();
    addPlayers();
    if (players.length < 2) {
      return false;
    }
    day = 0;
    document.getElementById("mainButton").innerHTML = "Begin!";
    document.getElementById("playerFieldWrapper").style.display = "none";
    document.getElementById("gamemakerActions").style.display = "inline-block";
    start();
  } else {document.getElementById("mainButton").innerHTML = "Next Day";day++;resolveDay();}
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
  alert(--settings.mapRadius);
  for (player of players) {
    (player.health > 0) && (player.distance = Math.min(player.distance,settings.mapRadius));
  }
}
function badEvent() {
  BAD_EVENT = true;
}