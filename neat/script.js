let theNetwork = neataptic.architect.Perceptron(2,3,1);
const trainingData = [{input:[0,0],output:[0]},{input:[0,1],output:[1]},{input:[1,0],output:[1]},{input:[1,1],output:[0]}];
const options = {
  log: 10,
  error: 0.03,
  iterations: 1000,
  rate: 0.3
};
async function test() {
  await theNetwork.evolve(trainingData,options);
}