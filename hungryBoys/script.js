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
Array.prototype.print = function() {
  for (const a of this) {print(a);}
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

function displayLogs(day=-1) {
  for (player of players) {
    print(player.name);
    print("<span class='indented'>" + player.log.map(o=>`Day ${o.day}: ${o.log}`).join("<br>").format(player) + "</span>")
  }
}
function addPlayers() {
  players = [];
  for (const element of document.getElementById("playerField").children) {
    players.push(new Player(element.firstElementChild.firstElementChild.value,element.firstElementChild.firstElementChild.nextElementSibling.value[0].toLowerCase(),players.length));
  }
}
function start() {
  if (document.getElementById("mainButton").innerHTML == "Start") {
    addPlayers();
    if (players.length < 2) {
      return false;
    }
    day = 0;
    document.getElementById("mainButton").innerHTML = "Next Day";
  } else {day++;resolveDay();}
}

function gameOver(player) {
  alert(player.name + " won!");
  document.getElementById("mainButton").innerHTML = "Start";
  displayLogs();
}

// Gamemaker actions
function lowerMapSize() {
  settings.mapRadius--;
  for (player of players) {
    (player.health > 0) && (player.distance = Math.min(player.distance,settings.mapRadius));
  }
}