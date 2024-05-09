const settings = {
  speedCritMult:0.075,
  snareCatchChance:0.5,
  weaponProficiencyCritBonus:0.2,
  trainingASBonus:0.5,
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
  constructor(name, pronounSet, index, scores=[0,2,4], skills=[]) {
    this.index = index;

    this.name = name;
    this.nameDisplay = `<span class="playerName" onclick="players[${this.index}].display()">${name}</span>`;
    this.pronouns = pronounSets[pronounSet];
    this.log = [];
    this.maxHealth = 100;
    this.health = 100;
    this.bleeding = 0;
    this.skills = Array.from(new Set(skills));
    this.maxDex = scores[0];
    this.maxStr = scores[1];
    this.maxInt = scores[2];
    if (this.hasSkill("Wrestling")) {
      this.maxDex += settings.trainingASBonus;
      this.maxStr += settings.trainingASBonus;
    } if (this.hasSkill("Ropes Course")) {
      this.maxDex += settings.trainingASBonus;
      this.maxStr += settings.trainingASBonus;
    } if (this.hasSkill("Weight-lifting")) {
      this.maxStr += 2*settings.trainingASBonus;
    } if (this.hasSkill("Obstacle Courses")) {
      this.maxDex += 2*settings.trainingASBonus;
    }
    this.dex = this.maxDex;
    this.str = this.maxStr;
    this.int = this.maxInt;
    this.proficiencies = [];
    for (const skill of this.skills) {
      if (skill in data.weaponProficiencies) {
        this.proficiencies.push(...data.weaponProficiencies[skill]);
      }
    }

    this.distance = 1;
    this.resources = {"random":0,"food":0,"water":0,"snares":0,"special":[]};
    this.weapons = {};
    this.shelter = 0;
    this.conditions = {};
    this.damages = {};
    this.kills = [];

    this.looted = false;
    this.dayDead = -1;
    this.dead = false;
    this.__deathMessage = "";
  }
  get status() {
    const a = this.health/this.maxHealth;
    let k;
    if (a <= 0) {k = "Dead";return `${this.name}: ${k}`}
    else if (a < 0.33) {k = "Bloodied";}
    else if (a < 0.67) {k = "Injured";}
    else if (a < 1) {k = "Bruised";}
    else {k = "Healthy";}
    let weap = this.damageAmount()[1].replace(/an? /,"");
    let final = `${this.name}: ${k}`+((this.health>0)?` | Weapon: ${weap[0].toUpperCase() + weap.slice(1)}`:"")
    if (Object.keys(this.conditions).length > 0 || this.shelter <= 0) {
      final += " | "+listFormat([...Object.keys(this.conditions).map(o=>conditionStatus[o]),...(this.shelter<=0?["Exposed"]:[])])
    }
    return final;
  }
  display() {
    modal(this.health);
  }
  get moveChance() {
    return (2/this.distance);
  }
  encounterChance(other) {
    let chance = Math.acos((this.distance**2 + other.distance**2 - settings.encounterDistanceSquared)/(2*other.distance*this.distance))/Math.PI/aliveNumber*2;
    if (other.hasCondition("camouflaged")||this.hasCondition("camouflaged")) {chance /= 2;}
    if (other.hasSpecialItem("Hammock")||this.hasSpecialItem("Hammock")) {chance /= 2;}
    return chance;
  }
  damageAmount(consume=false) {
    let finalWeapon = "no weapon";
    let final = this.str + 2;
    let finalS = final*settings.weaponProficiencyCritBonus*this.hasSkill("Hand-to-hand Combat");
    let q,s;
    for (const weapon in this.weapons) {
      if (this.weapons[weapon].ammunition === 0) {continue;}
      if (this.weapons[weapon].ability !== "str") {
        q = this.weapons[weapon].damage+this.dex;
        s = Math.max(0,q*(settings.speedCritMult*(this.weapons[weapon].speed)+(this.proficiencies.includes(weapon)?settings.weaponProficiencyCritBonus:0)));
        if ((q+s)>(finalS+final)) {finalS=s;final=q;finalWeapon = weapon;}
      }
      if (this.weapons[weapon].ability !== "dex") {
        q = this.weapons[weapon].damage+this.str;
        s = Math.max(0,q*(settings.speedCritMult*(this.weapons[weapon].speed)+(this.proficiencies.includes(weapon)?settings.weaponProficiencyCritBonus:0)));
        if ((q+s)>(finalS+final)) {finalS=s;final=q;finalWeapon = weapon;}
      }
    }
    if (consume && this.weapons[finalWeapon] && this.weapons[finalWeapon].ammunition !== -1) this.weapons[finalWeapon].ammunition--;
    return [final,finalWeapon,finalS/final];
  }
  forageAmount() {
    let food = Math.max(0,Math.floor(Math.random()*(this.int+Math.max(0,Math.max(this.dex,this.str)))));
    let random = Math.max(0,3-this.distance)+Math.max(0,Math.floor(Math.random()*(4-this.distance)));
    let water = Math.max(0,Math.floor(Math.random()*(2+this.int)));
    if (this.hasSkill("Edible Plants") || this.hasSkill("Edible Insects")) {food = Math.max(food,1);}
    let fished = false;
    if (this.hasSkill("Fish-hook Making") && water >= 2) {
      food = 1+Math.floor(Math.random()*5);
      fished = true;
    }
    return [
      random,
      food,
      water,
      (this.distance < 2)?choose2(data.weapons):false,
      fished
    ];
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
      this.addCondition("dehydrated");
      this.int -= 1;
      this.dex -= 1;
      return false;
    } else {
      if (this.int < this.maxInt) {this.int = this.maxInt;}
      if (this.dex < this.maxDex) {this.dex = this.maxDex;}
      this.removeCondition("dehydrated",this.hasCondition("dehydrated",1,true));
      return true;
    }
  }
  addWeapon(weapon) {
    if (!weapon.damage) {
      if (weapon in this.weapons) {
        this.weapons[weapon].amount += data.weapons[weapon].amount;
      } else {this.weapons[weapon] = structuredClone(data.weapons[weapon]);this.weapons[weapon].name = weapon;}
    } else {
      if (weapon.name in this.weapons) {
        this.weapons[weapon.name].amount += weapon.amount;
      } else {this.weapons[weapon.name] = weapon;}
    }
  }
  hasSkill(skill) {
    return this.skills.includes(skill);
  }
  hasSpecialItem(item) {
    return this.resources.special.includes(item);
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
        const usedMethods = [];
        if (this.resources["random"]) {
          this.resources["random"]--;
          this.removeCondition("bleeding",Math.ceil(this.hasCondition("bleeding",1,true)/2)+2);
          usedMethods.push("random fabric to staunch {possessive} bleeding");
        }
        if (this.resources["water"] > 1 && this.hasCondition("bleeding")) {
          this.consumeWater();
          this.removeCondition("bleeding",5);
          usedMethods.push("some water to clean {possessive} cuts");
        }
        // if (this.resources["food"] > 1 && this.hasCondition("bleeding")) {
        //   this.consumeFood();
        //   this.removeCondition("bleeding",3);
        // }
        const usedMethodsFormatted = listFormat(usedMethods);
        const stillBleeding = this.hasCondition("bleeding");
        if (usedMethodsFormatted) {this.log.push({day:day,log:"{name} used "+usedMethodsFormatted+(stillBleeding?", but {possessive} wounds are still oozing blood":"")});}
        if (stillBleeding) {this.damage(this.hasCondition(condition,1,true),condition);}
        break;
      case "burned":
        this.damage(amount,condition);
        let burnRemoved = false;
        while (this.resources.water > 1 && this.hasCondition("burned")) {
          this.resources.water--;
          this.removeCondition("burned",1);
          burnRemoved = true;
        }
      if (burnRemoved) {this.log.push({day:day,log:"{name} used water to treat {possessive} burns"+(this.hasCondition("burned")?", but {possessive} burns are still painful":"")});}
        break;
    }
  }
  deathMessage(messageOG,type,extra) {
    let message = messageOG;
    let max = 0;let m="";let p;for (const key in this.damages) {if ((p=this.damages[key])>max) {m=key;max=p}}
    if (m !== type) {

      message = message.replace("{name}",`{name}, ${weakenedMessages[m]},`);
    }
    this.__deathMessage = (extra?extra:type);
    this.log.push({day:day,log:message,death:true})
  }
  damage(amount, type, battle=false, kill=false) {
    if (!amount && !battle) {alert(type)}
    this.health -= amount;
    if (battle) this.addCondition("bleeding",amount);
    const key = battle?"battle":type;
    if (key in this.damages) this.damages[key] += amount;
    else this.damages[key] = amount;

    if (this.health <= 0 && !this.dead) {
      aliveNumber--;
      this.dead = true;
      this.dayDead = day;
      if (battle) {
        this.deathMessage(`{name} is killed in battle by ${type.player} with ${type.weapon}`,"battle",type);
      } else {
        this.deathMessage(deathMessages[type],type);
      }
      return true;
    } else {
      if (battle) {
        let battleLog = `{name} is wounded by ${type.player} with ${type.weapon}`;
        this.log.push({log:battleLog,day:day});
      }
      return false;
    }
  }
  fight(other,isOther=false) {
    let [damage1,weapon1,speed1] = this.damageAmount(true);
    let crit = false;
    if ((Math.random()) < speed1*settings.speedCritMult+(settings.weaponProficiencyCritBonus*this.proficiencies.includes(weapon1))) {damage1 *= 2;crit=true;}
    other.damage(damage1,{player:this.nameDisplay,weapon:weapon1},true);
    if (!isOther) {return [[damage1,weapon1,speed1],other.fight(this,isOther=true)];}
    return [damage1,weapon1,speed1];
  }
  loot(other) {
    this.resources.food += Math.max(0,other.resources.food - day + other.dayDead);
    this.resources.water += Math.max(0,other.resources.water - day + other.dayDead);
    this.resources.random += other.resources.random;
    for (const weapon of Object.values(other.weapons)) {this.addWeapon(weapon);}
    for (const item of other.resources.special) {this.resources.special.push(item);}
    other.looted = true;
  }
  endDay() {
    const result = {};
    // Resource tick and check
    for (const condition in this.conditions) {
      this.resolveCondition(condition,this.conditions[condition]);
    }
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
      this.player.log.push({day:day,log:`{name} loots ${this.player2.nameDisplay}'s corpse`});
    }
    if (this.player.dead || (this.player2 && this.player2.dead)) {
      return;
    }
    if (this.type === "forage") {
      this.data = this.player.forageAmount();
      if (this.player.resources.snares) {
        let amountTrapped = 0;
        for (let i = 0;i<this.player.resources.snares;i++) {
          if (Math.random() < settings.snareCatchChance) {amountTrapped++;}
        }
        this.player.resources.snares -= amountTrapped;
        this.player.resources.random += amountTrapped;
        this.player.resources.food += amountTrapped*(2+this.player.hasSkill("Knot Tying"));
        if (amountTrapped) {
          this.player.log.push({day:day,log:"{name} checks {possessive} snares and finds some"+(this.player.hasSkill("Knot Tying")?"":" small")+" game"});
        } else {
          this.player.log.push({day:day,log:"{name} checks {possessive} snares but finds nothing"});
        }
      }
      if (this.player.resources.random>0 && (this.player.int > 1 || this.player.hasSkill("Knot Tying")) && !this.player.hasCondition("bleeding")) {
        this.player.log.push({day:day,log:"{name} sets "+(this.player.resources.snares?"more":"some")+" snares"+(this.player.hasSkill("Knot Tying")?" using {possessive} knot-tying skills":"")});
        this.player.resources.snares += 1;
        this.player.resources.random -= 1;
      }
      this.player.resources.random += this.data[0];
      this.player.resources.food += this.data[1];
      this.player.resources.water += this.data[2];
      let weaponName;
      if (this.data[3]) {
        weaponName = data.weapons[this.data[3]].alias?data.weapons[this.data[3]].alias:this.data[3];
        this.player.addWeapon(weaponName);
      }
      let foodName = this.data[4]?"some fish":choose(data.foods[this.data[1]]);
      this.player.log.push({day:day,log:`{name} forages and finds ${foodName+(this.data[4]?' with {possessive} fish-hook making skills':'')}, ${data.water[this.data[2]]}, and ${choose(data.random[this.data[0]])}` + ((this.data[3])?`. {cap}{subject} also finds ${weaponName}`:"")});
      if (this.player.hasSkill("Fire-starting") && data.meats.includes(foodName)) {
        this.player.log.push({day:day,log:"{name} used {possessive} fire-making skills to smoke {possessive} "+foodName.split(" ")[1]+" and preserve the meat"});
        this.player.resources.food += 1;
      }
    }
    else if (this.type === "shelter") {
      // this.data = Math.floor(Math.random()*3);
      this.player.shelter += 1;
      if (this.player.hasSkill("Hammock-making")) {
        this.player.resources.special.push("Hammock");
        this.player.log.push({day:day,log:`{name} creates a hammock for {object}self`});
      } else {this.player.log.push({day:day,log:`{name} creates a shelter for {object}self`});}
    }
    else if (this.type === "move") {
      // this.player.shelter -= 1;
      this.player.distance += 1;
      this.player.log.push({day:day,log:`{name} moves further out from the Cornucopia`});
    }
    else if (this.type === "shelterMove") {
      this.player.shelter += 1;
      if (this.player.hasSkill("Hammock-making")) {
        this.player.resources.special.push("Hammock");
        this.player.log.push({day:day,log:`{name} creates a hammock for {object}self while moving farther from the Cornucopia`});
      } else {this.player.log.push({day:day,log:`{name} creates a shelter for {object}self while moving farther from the Cornucopia`});}
      this.player.distance += 1;
    }
    else if (this.type === "camouflage") {
      this.player.addCondition("camouflaged");
      this.player.log.push({day:day,log:`{name} gathers foliage and dirt, and uses it to camouflage {object}self`});
    }
    else if (this.type === "event") {
      let chosen = data.randomEvents[this.player2];
      this.data = Math.random() > chosen.chance;
      let playerDied = false;
      if ((!this.data || chosen.fail)) {
        this.player.log.push({day:day,log:(chosen.log + (this.data?chosen.fail:chosen.success))})
      }
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
            if (this.player.damage(amount,(effect.extra==="fight"?{player:effect.source,weapon:effect.weapon}:effect.damageType),effect.extra==="fight")) {playerDied = true;}
          }
        }
      }
      
    }
    else if (this.type === "fight") {
      this.data = this.player.fight(this.player2);
      if (!this.player.dead && this.player2.dead) {
        this.player.loot(this.player2);
        this.player.log[this.player.log.length-1].log += `, but kills ${this.player2.pronouns.object} with ${this.data[0][1]}`;
        this.player.kills.push(this.data[0][1]);
        this.player.log.push({day:day,log:`{name} loots ${this.player2.nameDisplay}'s corpse`});
      } else if (!this.player2.dead && this.player.dead) {
        this.player2.loot(this.player);
        this.player2.log[this.player2.log.length-1].log += `, but kills ${this.player.pronouns.object} with ${this.data[1][1]}`;
        this.player2.kills.push(this.data[1][1]);
        this.player2.log.push({day:day,log:`{name} loots ${this.player.nameDisplay}'s corpse`});
      }
      // this.player.log.push({day:day,log:(`{name} fights ${this.player2.nameDisplay} and ` + (this.data[0]?`takes ${this.data[0]} damage`:"emerges unscathed"))});
      // this.player2.log.push({day:day,log:(`{name} fights ${this.player.nameDisplay} and ` + (this.data[1]?`takes ${this.data[1]} damage`:"emerges unscathed"))});
    }
    else if (this.type === "peace") {
      this.player.log.push({day:day,log:`{name} sees ${this.player2.nameDisplay}, but remains hidden`});
      // this.player2.log.push({day:day,log:`{name} sees ${this.player.nameDisplay}, but remains hidden`});
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
      let action;let foundShelter = false;let moveChance = player.moveChance;
      
      if (player.resources.water === 0 || player.resources.food === 0) {action = "forage";}
      else if (((player.shelter && !(player.hasSkill("Camouflage") && !player.hasCondition("camouflaged"))) || moveChance>=1) && Math.random()<(moveChance) && player.distance < settings.mapRadius) {if (player.hasSkill("Shelter-making") && !player.shelter) {events.push(new Event("shelterMove",player));foundShelter = true;} else{action = "move";}}
      else if (!player.shelter && !foundShelter) {action = "shelter";}
      else if (player.hasSkill("Camouflage") && !player.hasCondition("camouflaged") &&player.resources.water > 1 && player.resources.food > 1) {action = "camouflage";}
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
      if (BAD_EVENT!==false) {
        events.push(new Event("event",player,BAD_EVENT));
      }
    }

  }
    BAD_EVENT = false;
  events = shuffle(events);
  for (const event of events) {
    const alive = players.filter(o=>o.health>0);
    const healths = alive.map(o=>o.health);
    try {event.resolve();}
    catch (e) {alert(e.stack)}
    const alive2 = players.filter(o=>o.health>0);
    if (alive2.length == 1) {
      gameOver(alive2[0]);
      return;
    } else if (alive2.length == 0) {
      gameOver(alive[healths.indexOf(Math.max(...healths))],died=true);
      return;
    }

  }
  const alive = players.filter(o=>o.health>0);
  const healths = alive.map(o=>o.health);
  resolveEndDay();
  const alive2 = players.filter(o=>o.health>0);
  if (alive2.length == 1) {
    gameOver(alive2[0]);
  } else if (alive2.length == 0) {
    gameOver(alive[healths.indexOf(Math.max(...healths))],died=true);
  } else {
    displayLogs(day);
  }
  updateStatus();
}

