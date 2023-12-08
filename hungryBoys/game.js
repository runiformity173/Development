const settings = {
  encounterDistanceSquared:4,
  mapRadius:8
};
let day = 0;
let aliveNumber = 0;
let BAD_EVENT = false;
function shuffle(a){const b=[...a];for(let c=b.length-1;0<c;c--){const a=Math.floor(Math.random()*(c+1));[b[c],b[a]]=[b[a],b[c]]}return b}
function choose2(o) {x = Object.keys(o);return x[Math.floor(Math.random()*x.length)];}
function randomNormal(min, max, mean, sigma) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0*Math.log(u))*Math.cos(2.0*Math.PI*v);
    return Math.max(min,Math.min(max,Math.round(z * sigma + mean)));
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
    this.maxDex = scores[0];
    this.maxStr = scores[1];
    this.maxInt = scores[2];
    this.dex = this.maxDex;
    this.str = this.maxStr;
    this.int = this.maxInt;

    this.distance = 1;
    this.resources = {"random":0,"food":0,"water":0};
    this.weapons = {};
    this.shelter = 0;
    this.conditions = {};

    this.looted = false;
    this.dayDead = -1;
    this.dead = false;
    this.deathMessage = "";
  }
  get status() {
    const a = this.health/this.maxHealth;
    let k;
    if (a <= 0) {k = "Dead";}
    else if (a < 0.33) {k = "Bloodied";}
    else if (a < 0.67) {k = "Injured";}
    else if (a < 1) {k = "Bruised";}
    else {k = "Healthy";}
    let weap = this.damageAmount()[1].replace(/an? /,"");
    return `${this.name}: ${k} | Weapon: ${weap[0].toUpperCase() + weap.slice(1)}`;
  }
  display() {
    modal(this.health+" | "+(this.bleeding));
  }
  encounterChance(other) {
    return Math.acos((this.distance**2 + other.distance**2 - settings.encounterDistanceSquared)/(2*other.distance*this.distance))/Math.PI/aliveNumber*2;
  }
  damageAmount(consume=false) {
    let finalWeapon = "no weapon";
    let final = this.str + 2;
    let finalS = 0;
    let q,s;
    for (const weapon in this.weapons) {
      if (this.weapons[weapon].ammunition === 0) {continue;}
      if (this.weapons[weapon].ability !== "str") {
        q = this.weapons[weapon].damage+this.dex;
        s = Math.max(0,q*(0.5*(this.weapons[weapon].speed-2)));
        if ((q+s)>(finalS+final)) {finalS=s;final=q;finalWeapon = weapon;}
      }
      if (this.weapons[weapon].ability !== "dex") {
        q = this.weapons[weapon].damage+this.str;
        s = Math.max(0,q*(0.5*(this.weapons[weapon].speed-2)));
        if ((q+s)>(finalS+final)) {finalS=s;final=q;finalWeapon = weapon;}
      }
    }
    if (consume && this.weapons[finalWeapon] && this.weapons[finalWeapon].ammunition !== -1) this.weapons[finalWeapon].ammunition--;
    if (consume) console.log(finalWeapon,final);
    return [final,finalWeapon,finalS];
  }
  forageAmount() {
    return [Math.max(0,3-this.distance)+Math.max(0,Math.floor(Math.random()*(4-this.distance))),Math.max(0,Math.floor(Math.random()*(2+this.int))),Math.max(0,Math.floor(Math.random()*(2+this.int))),(this.distance < 2)?choose2(data.weapons):false];
  }
  consumeFood() {
    if (this.resources["food"]-- == 0) {
      this.resources["food"] = 0;
      this.damage(10,"starving");
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
      this.damage(10,"dehydration");
      this.int -= 1;
      this.dex -= 1;
      return false;
    } else {
      if (this.int < this.maxInt) {this.int = this.maxInt;}
      if (this.dex < this.maxDex) {this.dex = this.maxDex;}
      return true;
    }
  }
  addWeapon(weapon) {
    if (!weapon.damage) {
      if (weapon in this.weapons) {
        this.weapons[weapon].amount += data.weapons[weapon].amount;
      } else {this.weapons[weapon] = data.weapons[weapon];this.weapons[weapon].name = weapon;}
    } else {
      if (weapon.name in this.weapons) {
        this.weapons[weapon.name].amount += weapon.amount;
      } else {this.weapons[weapon.name] = weapon;}
    }
  }
  addCondition(condition,amount=1) {
    if(condition in this.conditions){this.conditions[condition]+=amount}else{this.conditions[condition]=amount;}
  }
  removeCondition(condition,amount=1) {
    if(condition in this.conditions){ if ((this.conditions[condition]-=amount) < 1) {delete this.conditions[condition]}}
  }
  hasCondition(condition,amount=1,exact=false) {
    if (exact) {return this.conditions[condition]}
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

        this.damage(this.hasCondition(condition,exact=true),condition);
        break;
      case "burned":
        this.damage(amount,condition);
        while (this.resources.water > 1 && this.hasCondition("burned")) {
          this.resources.water--;
          this.removeCondition("burned",1)
        }
        break;
      default:
        this.damage(amount,condition);
        break;
    }
  }
  set deathMessage(message) {
    this.log.push({day:day,log:message})
  }
  damage(amount, type, battle=false) {
  
    this.health -= amount;
    if (battle) this.addCondition("bleeding",amount);
    if (this.health <= 0 && !this.dead) {
      aliveNumber--;
      this.dead = true;
      this.dayDead = day;
      if (battle) {
        this.deathMessage = `{name} is killed in battle by ${type.player} with ${type.weapon}`;
      } else {
        this.deathMessage = deathMessages[type];
      }
    } else {
      if (battle) {
        this.log.push({log:`{name} is wounded by ${type.player} with ${type.weapon}`,day:day});
      }
    }
  }
  fight(other,isOther=false) {
    let [damage1,weapon1,speed1] = this.damageAmount(true);
    let crit = false;
    if (Math.floor(Math.random()*(speed1-other.int)) > 0) {damage1 *= 2;crit=true;}
    other.damage(damage1,{player:this.nameDisplay,weapon:weapon1},true);
    if (!isOther) {return [damage1,other.fight(this,isOther=true)];}
    return damage1;
  }
  loot(other) {
    this.resources.food += Math.max(0,other.resources.food - day + other.dayDead);
    this.resources.water += Math.max(0,other.resources.water - day + other.dayDead);
    this.resources.random += other.resources.random;
    for (const weapon of Object.values(other.weapons)) {this.addWeapon(weapon);}
    other.looted = true;
  }
  endDay() {
    const result = {};
    // Resource tick and check
    this.consumeFood();
    this.consumeWater();
    if (this.shelter <= 0) {
      this.damage(5,"exposure");
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
    if (this.type === "loot" && !this.player.dead && !this.player2.looted) {
      this.player.loot(this.player2);
      this.player.log.push({day:day,log:`{name} loots ${this.player2.nameDisplay}'s corpse'`});
    }
    if (this.player.dead || (this.player2 && this.player2.dead)) {
      return;
    }
    if (this.type === "forage") {
      this.data = this.player.forageAmount();
      this.player.resources.random += this.data[0];
      this.player.resources.food += this.data[1];
      this.player.resources.water += this.data[2];
      if (this.data[3]) this.player.addWeapon(this.data[3]);
      this.player.log.push({day:day,log:`{name} forages and finds ${this.data[1]} food, ${this.data[2]} water, and ${this.data[0]} random` + ((this.data[3])?`. {cap}{subject} also finds ${this.data[3]}`:"")});
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
      let chosen = choose(data.randomEvents);
      this.data = Math.random() > chosen.chance;
      if (this.data) {
        for (const effect of chosen.effects) {
          let amount;
          if (effect.distribution.type === "normal") {
            amount = randomNormal(effect.distribution.min,effect.distribution.max,effect.distribution.mean,effect.distribution.sigma);
          } else if (effect.distribution.type === "uniform") {
            amount = effect.distribution.min + Math.floor(Math.random() * (effect.distribution.max - effect.distribution.min + 1))
          }
          if (effect.type == "condition") this.player.addCondition(effect.condition,amount)
          else if (effect.type == "damage") {
            this.player.damage(amount,(effect.extra==="fight"?{player:effect.source,weapon:effect.weapon}:effect.source),effect.extra==="fight")
          }
        }
      }
      if (!this.data || chosen.fail) {
        this.player.log.push({day:day,log:(chosen.log + (this.data?chosen.fail:chosen.success))})
      }
    }
    else if (this.type === "fight") {
      this.data = this.player.fight(this.player2);
      // this.player.log.push({day:day,log:(`{name} fights ${this.player2.nameDisplay} and ` + (this.data[0]?`takes ${this.data[0]} damage`:"emerges unscathed"))});
      // this.player2.log.push({day:day,log:(`{name} fights ${this.player.nameDisplay} and ` + (this.data[1]?`takes ${this.data[1]} damage`:"emerges unscathed"))});
    }
    else if (this.type === "peace") {
      this.player.log.push({day:day,log:`{name} sees ${this.player2.nameDisplay}, but remains hidden`});
      this.player2.log.push({day:day,log:`{name} sees ${this.player.nameDisplay}, but remains hidden`});
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
    if (!player.dead) {
      let action;
      if (player.resources.water === 0 || player.resources.food === 0) {action = "forage";}
      else if (!player.shelter && Math.random()<0.6 && player.distance < settings.mapRadius) {action = "move";}
      else if (!player.shelter) {action = "shelter";}
      else {action = "forage";}
      events.push(new Event(action,player));
      for (const player2 of players) {
        if (player2.index <= player.index) {continue;}
        if (player2.dead ) {events.push(new Event("loot",player,player2));continue;}
        if (Math.random()<player.encounterChance(player2)) {
          const encounterAction = choose(["fight","peace"]);
          if (Math.random() < 0.5) events.push(new Event(encounterAction,player,player2));
          else events.push(new Event(encounterAction,player2,player));
        }
      }
      if (BAD_EVENT) {
        events.push(new Event("event",player));
      }
    }
    
  }
    BAD_EVENT = false;
  events = shuffle(events);
  for (const event of events) {
    event.resolve();
    const alive = players.filter(o=>o.health>0);
    if (alive.length == 1) {
      console.log(players);

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
  } else {
    displayLogs(day);
  }
  updateStatus();
}