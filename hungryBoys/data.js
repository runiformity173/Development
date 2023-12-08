const deathMessages = {
  bleeding:"{name} bled to death from their wounds",
  burned:"{name} died of their burns",
  exposure:"{name} died of exposure",
  starving:"{name} starved to death",
  dehydration:"{name} died of dehydration"
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
    ]}
  ],
  foods:{
    "plants":{
      "edible leaves":1,
      "berries":2,
      "fruit":2
    },
    "animals":{
      "a squirrel":1,
      "a rabbit":2,
      "a ":1
    }
  },
  shelters:[
    "a tree",
    "an unknown animal's den",
    "your mom's house",
    "a riverbed",
    "a cave",
    "a dumpster"
  ],
  heals:{
    "a gapple":10,
    "bandages":3,
    "an apple":2,
    "a mysterious drink":4,
    "a picture of a kitten":5
  },
  disasters:{
    "A pack of rabid mutants is let loose into the arena":{"damage":[0,0,0,0,3,3,8],"deathCause":"Killed by mutants","message":{"0":"{name} was safe","3":"{name} was bitten","8":"{name} was mauled"}},
    "A huge tornado sweeps across the land":{"damage":[0,0,0,0,1,1,1,3,7,10],"deathCause":"Died in a tornado","message":{"0":"{name} was safe","1":"{name} felt the wind","3":"{name} was blown around","7":"{name} was battered","10":"{name} was picked up"}},
    "A forest fire ravages the land":{"damage":[0,1,2,2,3,3,6],"deathCause":"Died in a forest fire","message":{"0":"{name} was safe","1":"{name} felt the heat","3":"{name} was scorched","6":"{name} was incinerated","2":"{name} was burned"}}
  },
  waits:[
    "{name} sneezed",
    "{name} walked around in circles",
    "{name} decided to sleep in",
    "{name} twiddled {possessive} thumbs",
    "{name} waited and hoped that everyone else would randomly die"
  ],
  randomItems:{
    "a copy of Sun Tzu: The Art of War":"{name} read The Art of War, hoping that that would help {possessive} chances of victory",
    "a magic wand":"{name} waved {possessive} magic wand, turning {object}self into a {animal} and back",
    "a magic wand":"{name} waved {possessive} magic wand, turning {object}self into a {animal} and back"
  },
  badEvents:{
    "{name} was attacked by a large anthropomorphic wheel of gouda":{"type":"damage","effect":[4,"Died from lactose intolerance"]},
    "{name} was forced to watch the Bee Movie":{"type":"damage","effect":[10,"Died of cringe"]},
    "{name} tripped on a stick":{"type":"damage","effect":[1,"Died of clumsiness"]},
    "{name} got tangled in a bush":{"type":"damage","effect":[1,"Died of clumsiness"]},
    "{name} tripped on some moss":{"type":"damage","effect":[1,"Died of clumsiness"]},
    "{name} poked {object}self":{"type":"damage","effect":[1,"Died of clumsiness"]},
    "{name} slept under a nest of tracker jackers":{"type":"damage","effect":[3,"Died of drug hornets"]},
    "{name} was struck by lightning":{"type":"damage","effect":[5,"Died of electrocution"]},
    "{name} got their baby photos leaked to the public":{"type":"damage","effect":[6,"Died of embarrasment"]},
    "{name} caught a cold":{"type":"condition","effect":[1,"sickness (cold)","sick (cold)"],"else":"A cold tried to infect {name}, but {subject} already has it"},
    "{name} caught a cold":{"type":"condition","effect":[1,"sickness (cold)","sick (cold)"],"else":"A cold tried to infect {name}, but {subject} already has it"},
    "{name} caught the Delta Variant":{"type":"condition","effect":[2,"sickness (COVID-19)","sick (COVID-19)"],"else":"The Delta Variant tried to infect {name}, but {subject} already has it"},
    "{name} caught the Delta Variant":{"type":"condition","effect":[2,"sickness (COVID-19)","sick (COVID-19)"],"else":"The Delta Variant tried to infect {name}, but {subject} already has it"}
  },
  animals:["bat", "bear", "beaver", "bee", "beetle", "boar", "bull", "butterfly", "camel", "cat", "chameleon", "chicken", "cobra", "cockroach", "cow", "crab", "crocadile", "crow", "deer", "dodo", "dog", "dolphin", "dragon", "duck", "falcon", "fish", "flamingo", "fly", "fox", "frog", "gecko", "giraffe", "gnat", "gnu", "goat", "goose", "gopher", "gorilla", "griffin", "gull", "hamster", "hare", "hawk", "hedgehog", "heron", "horse", "hyena", "jackal", "jaguar", "kangaroo", "kitten", "kiwi", "ladybug", "lemur", "leopard", "lion", "lizard", "llama", "lynx", "mammoth", "mantis", "meerkat", "mink", "monkey", "moth", "mule", "panda", "parrot", "peacock", "penguin", "phoenix", "pigeon", "piranha", "pony", "puffin", "pug", "puma", "python", "quokka", "rabbit", "raccoon", "rat", "raven", "rhino", "scorpion", "seal", "shark", "sheep", "shrimp", "skunk", "sloth", "snail", "spider", "squid", "squirrel", "starfish", "swallow", "swan", "tapir", "tiger", "toad", "turkey", "turtle", "walrus", "wasp", "whale", "wolf", "wombat", "yak", "zebra"]
};



//Archery, Axes, Camouflage, Edible insects, Edible plants, Fire-starting, Fish hooks, obstacle courses, Hammock-making, Hand-to-hand combat, Knives, Knot tying, Ropes course, Shelter-making, Slingshots, Spears, Swords, Tridents, Weight-lifting, Wrestling, 