let gods;
const k = {};
for (const w of settingList) {
const p = godData[w];
for (let i = 0;i<p.length;i++) {p[i].push(i);}
k[w] = p;
}
function start() {
  const setting = document.getElementById("setting").value;
  const alignment = reverseAlignmentMap[document.getElementById("alignment").value];
  const domain = document.getElementById("domain").value;
  gods = godData[setting];
  if (alignment !== "Any") gods = gods.filter(o=>o[1]===alignment)
  if (domain !== "Any") gods = gods.filter(o=>o[2].includes(domain))
  document.getElementById("output").innerHTML = "";
  for (const god of gods) {
    document.getElementById("output").innerHTML += `<a href="#${settingList.indexOf(setting)}-${god[4]}">${god[0]}</a><br>`;
  }
}
function hashChange() {
  if (!location.hash) {return;}
  const [setting,gIndex] = location.hash.replace("#","").split("-");
  const d = godData[settingList[setting]][gIndex];
  document.getElementById("output2").innerHTML = `Name: ${d[0]}<br>Alignment: ${alignmentMap[d[1]]}<br>Domains: ${d[2]}<br>Symbol: ${d[3]}`;
}
hashChange();
window.addEventListener("hashchange",hashChange);