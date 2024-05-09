const TYPE = {
  basic_conveyor:"conveyor",
  basic_storage:"storage",
  smelter:"machine",
  crafter:"machine"
}
const HAS_INVENTORY = new Set(["conveyor", "storage", "machine"]);
const MACHINES = {
  smelter:{
    recipes:[{
      inputs:[{id:"iron_ore",amount:2}],
      output:{id:"iron_ingot",amount:1},
      craftingTime:10
    }],
    slots:1
  },
  crafter:{
    recipes:[{
      inputs:[{id:"iron_ingot",amount:1}],
      output:{id:"iron_sheet",amount:2},
      craftingTime:10
    }],
    slots:1
  }
};
const STORAGES = {
  basic_storage:{
    slots:12
  }
};
const CONVEYORS = {
  basic_conveyor:{
    speed:10
  }
}