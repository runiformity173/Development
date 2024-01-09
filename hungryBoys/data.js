const deathMessages = {
  bleeding:"{name} bleeds to death from {possessive} wounds",
  burned:"{name} dies of {possessive} burns",
  exposure:"{name} dies of exposure",
  starving:"{name} starves to death",
  dehydration:"{name} dies of dehydration"
}
const almostDeathMessages = {
  bleeding:"{name} almost bleeds to death from {possessive} wounds",
  burned:"{name} almost dies of {possessive} burns",
  exposure:"{name} almost dies of exposure",
  starving:"{name} almost starves to death",
  dehydration:"{name} almost dies of dehydration"
}
const weakenedMessages = {
  bleeding:"weakened by bleeding out",
  burned:"heavily burned",
  exposure:"weakened by exposure to the elements",
  starving:"weakened by hunger",
  dehydration:"weakened by lack of water",
  
  battle:"injured from battle"
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
  weapons:{
    "a battleaxe":{"damage":10,"speed":-2,"ability":"str","ammunition":-1},
    "throwing axes":{"damage":6,"speed":2,"ability":"str","ammunition":2},
    "a bow and arrow":{"damage":8,"speed":4,"ability":"dex","ammunition":10},
    "a knife":{"damage":4,"speed":3,"ability":"either","ammunition":-1},
    "a kukri":{"damage":6,"speed":2,"ability":"either","ammunition":-1},
    "throwing knives":{"damage":4,"speed":3,"ability":"dex","ammunition":3},
    "a mace":{"damage":8,"speed":0,"ability":"str","ammunition":-1},
    "a machete":{"damage":6,"speed":2,"ability":"str","ammunition":-1},
    "a spiked chain":{"damage":8,"speed":0,"ability":"either","ammunition":-1},
    "a sickle":{"damage":6,"speed":2,"ability":"either","ammunition":-1},
    "a slingshot":{"damage":4,"speed":3,"ability":"dex","ammunition":-1},
    "a spear":{"damage":8,"speed":1,"ability":"str","ammunition":-1},
    "a sword":{"damage":10,"speed":-1,"ability":"str","ammunition":-1},
    "a trident":{"damage":8,"speed":0,"ability":"str","ammunition":-1}
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
      }
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
      }
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
  water:[
    "no water",
    "some water",
    "some water",
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
    ["some medicine","a lot of fabric"]
  ],
  shelters:[
    
  ],
  animals:["bat", "bear", "beaver", "bee", "beetle", "boar", "bull", "butterfly", "camel", "cat", "chameleon", "chicken", "cobra", "cockroach", "cow", "crab", "crocadile", "crow", "deer", "dodo", "dog", "dolphin", "dragon", "duck", "falcon", "fish", "flamingo", "fly", "fox", "frog", "gecko", "giraffe", "gnat", "gnu", "goat", "goose", "gopher", "gorilla", "griffin", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "horse", "hyena", "jackal", "jaguar", "kangaroo", "kitten", "kiwi", "ladybug", "lemur", "leopard", "lion", "lizard", "llama", "lynx", "mammoth", "mantis", "meerkat", "mink", "monkey", "moth", "mule", "panda", "parrot", "peacock", "penguin", "phoenix", "pigeon", "piranha", "pony", "puffin", "pug", "puma", "python", "quokka", "rabbit", "raccoon", "rat", "raven", "rhino", "scorpion", "seal", "shark", "sheep", "shrimp", "skunk", "sloth", "snail", "spider", "squid", "squirrel", "starfish", "swallow", "swan", "tapir", "tiger", "toad", "turkey", "turtle", "walrus", "wasp", "whale", "wolf", "wombat", "yak", "zebra"]
};



//Archery, Axes, Camouflage, Edible insects, Edible plants, Fire-starting, Fish hooks, obstacle courses, Hammock-making, Hand-to-hand combat, Knives, Knot tying, Ropes course, Shelter-making, Slingshots, Spears, Swords, Tridents, Weight-lifting, Wrestling, 