const settings = {
  encounterDistanceSquared:4,
  mapRadius:8
};
let day = 0;
function shuffle(a){const b=[...a];for(let c=b.length-1;0<c;c--){const a=Math.floor(Math.random()*(c+1));[b[c],b[a]]=[b[a],b[c]]}return b}
function choose2(o) {x = Object.keys(o);return x[Math.floor(Math.random()*x.length)];}
function randomNormal(min, max, mean, sigma) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0*Math.log(u))*Math.cos(2.0*Math.PI*v);
    return Math.max(min,Math.min(max,z * sigma + mean));
}
class Player {
  constructor(name, pronounSet, index, scores=[0,2,4]) {
    this.index = index;
    
    this.name = name;
    this.nameDisplay = `<span class="playerName" onclick="players[${this.index}].display()">${name}</span>`;
    this.pronouns = pronounSets[pronounSet];
    this.log = [];
    
    this.maxHealth = 100;
    this.health = 100;
    this.bleeding = 0;
    this.maxDex = scores[0]-1;
    this.maxStr = scores[1];
    this.maxInt = scores[2];
    this.dex = this.maxDex;
    this.str = this.maxStr;
    this.int = this.maxInt;

    this.distance = 1;
    this.resources = {"random":0,"food":0,"water":0};
    this.weapons = [];
    this.shelter = 0;
    this.conditions = {};

    this.looted = false;
    this.dayDead = -1;
  }
  get status() {
    const a = this.health/this.maxHealth;
    if (a <= 0) {return "Dead";}
    if (a < 0.33) {return "Bloodied";}
    if (a < 0.67) {return "Injured";}
    if (a < 1) {return "Bruised";}
    if (a == 1) {return "Healthy";}
  }
  display() {
    modal(this.health+" | "+(this.bleeding));
  }
  encounterChance(other) {
    return Math.acos((this.distance**2 + other.distance**2 - settings.encounterDistanceSquared)/(2*other.distance*this.distance))/Math.PI;
  }
  forageAmount() {
    return [Math.max(0,3-this.distance)+Math.max(0,Math.floor(Math.random()*(4-this.distance))),Math.max(0,Math.floor(Math.random()*(1+this.int))),Math.max(0,Math.floor(Math.random()*(1+this.int)))];
  }
  consumeFood() {
    if (this.resources["food"]-- == 0) {
      this.resources["food"] = 0;
      this.health -= 10;
      this.str -= 1;
      return false;
    } else {
      if (this.str < this.maxStr) {this.str = this.maxStr;}
      return true;
    }
  }
  consumeWater() {
    if (this.resources["water"]-- == 0) {
      this.resources["water"] = 0;
      this.health -= 10;
      this.int -= 1;
      this.dex -= 1;
      return false;
    } else {
      if (this.int < this.maxInt) {this.int = this.maxInt;}
      if (this.dex < this.maxDex) {this.dex = this.maxDex;}
      return true;
    }
  }
  addCondition(condition,amount=1) {
    if(condition in this.conditions){this.conditions[condition]+=amount}else{this.conditions[condition]=amount;}
  }
  removeCondition(condition,amount=1) {
    if(condition in this.conditions){ if ((this.conditions[condition]-=amount) < 1) {delete this.conditions[condition]}}
  }
  hasCondition(condition,amount=1) {
    return this.conditions[condition] && this.conditions[condition] >= amount;
  }
  resolveCondition(condition,amount) {
    switch (condition) {
      case "bleeding":
        if (this.resources["random"]) {
          this.resources["random"]--;
          this.removeCondition("bleeding",Math.ceil(this.bleeding/2)+2);
        }
        if (this.resources["water"] > 1 && this.hasCondition("bleeding")) {
          this.consumeWater();
          this.removeCondition("bleeding",5);
        }
        if (this.resources["food"] > 1 && this.hasCondition("bleeding")) {
          this.consumeFood();
          this.removeCondition("bleeding",3);
        }

        this.health -= amount;
        break;
      case "burned":
        this.health -= amount;
        while (this.resources.water > 1 && this.hasCondition("burned")) {
          this.resources.water--;
          this.removeCondition("burned",1)
        }
        
        break;
      default:
        this.health -= amount;
        break;
    }
  }
  damage(amount, bleed=true) {
    this.health -= amount;
    if (bleed) this.addCondition("bleeding",amount);
  }
  fight(other,isOther=false) {
    const damage1 = Math.floor(Math.random()*5) + this.str;
    other.damage(damage1);
    if (!isOther) {return [damage1,other.fight(this,isOther=true)];}
    return damage1;
  }
  loot(other) {
    this.resources.food += Math.max(0,other.resources.food - day + other.dayDead);
    this.resources.water += Math.max(0,other.resources.water - day + other.dayDead);
    this.resources.random += other.resources.random;
    this.weapons = this.weapons.concat(other.weapons);
    other.looted = true;
  }
  endDay() {
    const result = {};
    // Resource tick and check
    this.consumeFood();
    this.consumeWater();
    if (this.shelter == 0) {
      this.health -= 5;
    }
    if (this.health <= 0) {
      this.dayDead = day;
      result.dead = true;
    }
    return result;
  }
}
class Event {
  constructor(type, player, player2=null) {
    this.type = type;
    this.data = data;
    this.player = player;
    this.player2 = player2;
  }
  resolve() {
    if (this.type === "forage") {
      this.data = this.player.forageAmount();
      this.player.resources.random += this.data[0];
      this.player.resources.food += this.data[1];
      this.player.resources.water += this.data[2];
      this.player.log.push({day:day,log:`{name} forages and finds ${this.data[1]} food, ${this.data[2]} water, and ${this.data[0]} random.` + ((this.distance<2)?` {cap}{subject}`:"")});
    }
    else if (this.type === "shelter") {
      // this.data = Math.floor(Math.random()*3);
      this.player.shelter += 1;
      this.player.log.push({day:day,log:`{name} creates a shelter for {object}self`});
    }
    else if (this.type === "move") {
      this.player.shelter -= 1;
      this.player.distance += 1;
      this.player.log.push({day:day,log:`{name} moves further out from the Cornucopia`});
    }
    else if (this.type === "event") {
      chosen = choose(data.randomEvents);
      this.data = Math.random() < this.data.chance;
      if (this.data) {
        for (effect in chosen.effects) {
          let amount;
          if (effect.distribution.type === "normal") {
            amount = randomNormal(effect.distribution.min,effect.distribution.max,effect.distribution.mean,effect.distribution.sigma);
          } else if (effect.distribution.type === "uniform") {
            amount = effect.distribution.min + Math.floor(Math.random() * (effect.distribution.max - effect.distribution.min + 1))
          }
          this.player.addCondition(effect.condition,amount)
        }
      }
      this.player.log.push({day:day,log:(chosen.log + (this.data?chosen.fail:chosen.success))})
    }
    else if (this.type === "fight") {
      this.data = this.player.fight(this.player2);
      this.player.log.push({day:day,log:(`{name} fights ${this.player2.nameDisplay} and ` + (this.data[0]?`takes ${this.data[0]} damage`:"emerges unscathed"))});
      this.player2.log.push({day:day,log:(`{name} fights ${this.player.nameDisplay} and ` + (this.data[1]?`takes ${this.data[1]} damage`:"emerges unscathed"))});
    }
    else if (this.type === "peace") {
      this.player.log.push({day:day,log:`{name} sees ${this.player2.nameDisplay} but they agree to leave each other alone`});
      this.player2.log.push({day:day,log:`{name} sees ${this.player.nameDisplay} but they agree to leave each other alone`});
    }
  }
}

let players = [];
let dayEvents = [];


function resolveEndDay() {
  for (const player of players) {
    if (player.dead) {continue;}
    const result = player.endDay();
    if (result.dead) {
      // players.splice(player.index,1);
      // for (let i = player.index;i<players.length;i++) {
      //   players[i].index--;
      // }
      
    }
  }
}
function resolveDay() {
  clear();
  events = [];
  for (const player of players) {
    if (player.health > 0) {
      let action;
      if (Math.random()<0.4 && player.distance < settings.mapRadius) {action = "move";}
      else if (!player.shelter) {action = "shelter";}
      else {action = "forage";}
      events.push(new Event(action,player));
      for (const player2 of players) {
        if (player2.index == player.index) {continue;}
        if (player2.health < 1) {events.push(new Event("loot",player,player2));continue;}
        if (Math.random()<player.encounterChance(player2)) {
          const encounterAction = choose(["fight","peace"]);
        events.push(new Event(encounterAction,player,player2));
        }
      }
    }
    
  }
  events = shuffle(events);
  for (const event of events) {
    event.resolve();
    const alive = players.filter(o=>o.health>0);
    if (alive.length == 1) {
      gameOver(alive[0]);
      return;
    }
  }
  const alive = players.filter(o=>o.health>0);
  const healths = players.map(o=>o.health-o.bleeding);
  resolveEndDay();
  if (alive.length == 1) {
    gameOver(alive[0]);
  } else if (alive.length == 0) {
    gameOver(players[healths.indexOf(Math.max(...healths))]);
  }
  
}