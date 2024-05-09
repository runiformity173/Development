const deathMessages = {
  bleeding:"{name} bleeds to death from {possessive} wounds",
  burned:"{name} dies of {possessive} burns",
  fire:"{name} burns to death",
  exposure:"{name} dies of exposure",
  starving:"{name} starves to death",
  dehydration:"{name} dies of dehydration"
}
const almostDeathMessages = {
  bleeding:"{name} almost bleeds to death from {possessive} wounds",
  burned:"{name} almost dies of {possessive} burns",
  fire:"{name} nearly burns to death",
  exposure:"{name} almost dies of exposure",
  starving:"{name} almost starves to death",
  dehydration:"{name} almost dies of dehydration"
}
const weakenedMessages = {
  bleeding:"weakened by bleeding out",
  burned:"heavily burned",
  fire:"injured by flames",
  exposure:"weakened by exposure to the elements",
  starving:"weakened by hunger",
  dehydration:"weakened by lack of water",
  
  battle:"injured from battle"
}
const conditionStatus = {
  camouflaged:"Camouflaged",
  bleeding:"Bleeding",
  burned:"Burned",
  starving:"Starving",
  dehydrated:"Dehydrated"
}
const pronounSets = {
  m:{
    subject:"he",
    object:"him",
    possessive:"his"
  },
  f:{
    subject:"she",
    object:"her",
    possessive:"her"
  },
  g:{
    subject:"they",
    object:"them",
    possessive:"their"
  },
  o:{
    subject:"it",
    object:"it",
    possessive:"its"
  }
};
const data = {
  weaponProficiencies:{
    "Archery":["a bow and arrow"],
    "Axes":["throwing axes","a battleaxe"],
    "Knives":["throwing knives","a kukri","a knife"],
    "Slingshots":["a slingshot"],
    "Spears":["a spear"],
    "Swords":["a sword","a machete"],
    "Tridents":["a trident"]
  },
  weapons:{
    "a battleaxe":{"damage":10,"speed":0,"ability":"str","ammunition":-1},
    "throwing axes":{"damage":8,"speed":4,"ability":"str","ammunition":2},
    "a bow and arrow":{"damage":8,"speed":6,"ability":"dex","ammunition":10},
    "a bow and arrow2":{"alias":"a bow and arrow"},
    "a knife":{"damage":4,"speed":5,"ability":"dex","ammunition":-1},
    "a knife2":{"alias":"a knife"},
    "a kukri":{"damage":6,"speed":4,"ability":"either","ammunition":-1},
    "throwing knives":{"damage":4,"speed":6,"ability":"dex","ammunition":3},
    "throwing knives2":{"alias":"throwing knives"},
    "a mace":{"damage":8,"speed":2,"ability":"str","ammunition":-1},
    "a machete":{"damage":6,"speed":4,"ability":"str","ammunition":-1},
    "a spiked chain":{"damage":8,"speed":2,"ability":"either","ammunition":-1},
    "a sickle":{"damage":6,"speed":4,"ability":"either","ammunition":-1},
    "a slingshot":{"damage":4,"speed":5,"ability":"dex","ammunition":-1},
    "a spear":{"damage":8,"speed":3,"ability":"str","ammunition":-1},
    "a sword":{"damage":10,"speed":1,"ability":"str","ammunition":-1},
    "a sword2":{"alias":"a sword"},
    "a trident":{"damage":8,"speed":2,"ability":"str","ammunition":-1}
  },
  // Chance is chance of the success condition
  randomEvents:[
    {"log":"{name} is trapped in a forest fire ", "fail":"and gets burned","chance":0.5,"success":"but escapes unharmed","effects":[
      {
      "type":"condition",
      "condition":"burned",
      "distribution":{
        "type":"normal",
        "min":1,
        "max":Infinity,
        "mean":5,
        "sigma":2
      }
    },
    {
      "type":"damage",
      "distribution":{
        "type":"normal",
        "min":1,
        "max":Infinity,
        "mean":10,
        "sigma":4
      },
      "damageType":"fire"
    },
    ]},
    {"log":"{name} is attacked by mutts ","chance":0.33,"success":"but escapes unharmed","effects":[
      {
      "type":"damage",
      "extra":"fight",
      "weapon":[["their claws"]],
      "source":["a mutt"],
      "distribution":{
        "type":"normal",
        "min":1,
        "max":Infinity,
        "mean":7,
        "sigma":3
      }
    }
    ]},
    {"log":"{name} is caught in a thunderstorm ", "fail":"and gets injured from the wind","chance":0.3,"success":"but escapes unharmed","effects":[
    {
      "type":"damage",
      "distribution":{
        "type":"normal",
        "min":1,
        "max":Infinity,
        "mean":10,
        "sigma":3
      },
      "damageType":"exposure"
    },
    ]},
  ],
  foods:[
    ["no food","only rotten fruit"],
    ["edible leaves","berries","a squirrel", "a bird"],
    ["some fruit","a rabbit"],
    ["some squirrels", "many fruits"],
    ["some rabbits"],
    ["a deer","a boar"],
    ["a deer","a boar"],
    ["a deer","a boar"]
  ],
  meats:[
    "a deer","a boar","some rabbits","some squirrels","a rabbit","a squirrel","a bird","some fish"
  ],
  water:[
    "no water",
    "some water",
    "a pond",
    "a creek",
    "a stream",
    "a river",
    "a lake",
    "a lake"
  ],
  random:[
    ["nothing else of value"],
    ["some rope","some fabric"],
    ["some bandages"],
    ["a lot of rope"],
    ["some medicine","a lot of fabric"],
    ["some medicine","a lot of fabric"],
    ["some medicine","a lot of fabric"],
    ["some medicine","a lot of fabric"],
    ["some medicine","a lot of fabric"],
  ],
  shelters:[
    
  ],
  animals:["bat", "bear", "beaver", "bee", "beetle", "boar", "bull", "butterfly", "camel", "cat", "chameleon", "chicken", "cobra", "cockroach", "cow", "crab", "crocadile", "crow", "deer", "dodo", "dog", "dolphin", "dragon", "duck", "falcon", "fish", "flamingo", "fly", "fox", "frog", "gecko", "giraffe", "gnat", "gnu", "goat", "goose", "gopher", "gorilla", "griffin", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "horse", "hyena", "jackal", "jaguar", "kangaroo", "kitten", "kiwi", "ladybug", "lemur", "leopard", "lion", "lizard", "llama", "lynx", "mammoth", "mantis", "meerkat", "mink", "monkey", "moth", "mule", "panda", "parrot", "peacock", "penguin", "phoenix", "pigeon", "piranha", "pony", "puffin", "pug", "puma", "python", "quokka", "rabbit", "raccoon", "rat", "raven", "rhino", "scorpion", "seal", "shark", "sheep", "shrimp", "skunk", "sloth", "snail", "spider", "squid", "squirrel", "starfish", "swallow", "swan", "tapir", "tiger", "toad", "turkey", "turtle", "walrus", "wasp", "whale", "wolf", "wombat", "yak", "zebra"]
};
const backgroundSkills = ["Archery","Axes","Camouflage","Edible Insects","Edible Plants","Fire-starting","Fish-hook Making","Hammock-making","Hand-to-hand Combat","Knives","Knot Tying","Shelter-making","Slingshots","Spears","Swords","Tridents"];
const stationSkills = ["Archery","Axes","Camouflage","Edible Insects","Edible Plants","Fire-starting","Fish-hook Making","Obstacle Courses","Hammock-making","Hand-to-hand Combat","Knives","Knot Tying","Ropes Course","Shelter-making","Slingshots","Spears","Swords","Tridents","Weight-lifting","Wrestling"];
const DEFAULT_SETUP = [{"name":"Katniss","pronoun":"Female","primary":"Dexterity","secondary":"Intelligence","skills":["Archery","Edible Plants"]},{"name":"Rue","pronoun":"Female","primary":"Dexterity","secondary":"Intelligence","skills":["Edible Plants","Obstacle Courses"]},{"name":"Cato","pronoun":"Male","primary":"Strength","secondary":"Strength","skills":["Swords","Weight-lifting"]},{"name":"Glimmer","pronoun":"Female","primary":"Dexterity","secondary":"Strength","skills":["Knives","Swords"]},{"name":"Marvel","pronoun":"Male","primary":"Strength","secondary":"Dexterity","skills":["Axes","Spears"]},{"name":"Peeta","pronoun":"Male","primary":"Strength","secondary":"Intelligence","skills":["Camouflage","Weight-lifting"]},{"name":"Foxface","pronoun":"Female","primary":"Intelligence","secondary":"Intelligence","skills":["Fire-starting","Shelter-making"]},{"name":"Clove","pronoun":"Female","primary":"Dexterity","secondary":"Strength","skills":["Knives","Obstacle Courses"]},{"name":"Thresh","pronoun":"Male","primary":"Strength","secondary":"Intelligence","skills":["Spears","Shelter-making"]}];
/*
Archery - proficiency in bows
Axes - proficiency in axes
Camouflage - -conflict action
Edible insects - +min food
Edible plants - +min food
Fire-starting - meat catches are +1 food
Fish hooks - +fishing action
obstacle courses - +dex +dex
Hammock-making - when making shelter -conflict
Hand-to-hand combat - proficiency in no weapon
Knives - proficiency in knives
Knot tying - +snares (more meat per snare)
Ropes course - +dex +strength
Shelter-making - shelter making doesn't take a turn while moving
Slingshots - proficiency in slingshots
Spears - proficiency in spears
Swords - proficiency in swords
Tridents - proficiency in tridents
Weight-lifting - +strength +strength
Wrestling - +strength +dex
*/



/*
TODO

Sponsors?
*/