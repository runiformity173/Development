function $(o){return document.getElementById(o);}
Object.defineProperties(Array.prototype, {count: {value: function(value) {return this.filter(x => x==value).length;}}});
let AMOUNT = 10;
data = data.split("\n\n").map((a)=>a.split("\t"));
const terms = data.map(a=>a[0]);
const definitions = data.map(a=>a[1]);
$("question").style.height = 16*(Math.max(...(definitions.map(o=>[...o].count("\n"))))+2)+"px";

let TOTAL_N = terms.length;
let done = new Set();
let NEXT_ANSWER = 0;
function moreQuestions() {
  const amt = Math.min(Math.max(5,AMOUNT+10),TOTAL_N);
  AMOUNT = amt;
  alert("GOING TO "+amt);
}
function nextQuestion() {
  if (done.size == TOTAL_N) {
    alert("DONE, YO");
    return;
  }
  if (done.size == AMOUNT) {
    moreQuestions();
  }
  var i = Math.floor(Math.random()*AMOUNT);
  while (done.has(i)) {
    i = Math.floor(Math.random()*AMOUNT);
  }
  NEXT_ANSWER = i;
  const doing = [];
  while (doing.length < 4) {
    const next = Math.floor(Math.random()*TOTAL_N);
    if (!(doing.includes(next)) && next !== i) {doing.push(next);}
  }
  const correct = "ans"+(Math.floor(Math.random()*4)+1);
  $("ans1").innerHTML = terms[doing[0]];
  $("ans2").innerHTML = terms[doing[1]];
  $("ans3").innerHTML = terms[doing[2]];
  $("ans4").innerHTML = terms[doing[3]];
  $(correct).innerHTML = terms[i];
  $("ans1").onclick = wrongAnswer;
  $("ans2").onclick = wrongAnswer;
  $("ans3").onclick = wrongAnswer;
  $("ans4").onclick = wrongAnswer;
  $(correct).onclick = rightAnswer;
  $("question").innerHTML = definitions[i].replaceAll("\n","<br>");
}
function rightAnswer() {
  $("correct").innerHTML = "CORRECT";
  done.add(NEXT_ANSWER);
  nextQuestion();
}
function wrongAnswer() {
  $("correct").innerHTML = terms[NEXT_ANSWER];
  nextQuestion();
}
nextQuestion();