let counter = 0;
function compare(a,b) {
  counter++;
  return confirm(`Is ${a} better than ${b}?`)?-1:1;
}
function binarySearch(a,  item,  low,  high)
{
  while (low <= high) {
    var mid = low + Math.floor((high - low) / 2);
    let comp = compare(item,a[mid])
    if (comp == 0)
      return mid + 1;
    else if (comp == 1)
      low = mid + 1;
    else
      high = mid - 1;
  }
  return low;
}
function insertionSort(a, n)
{
  var i, loc, j, selected;
  for (i = 1; i < n; ++i) {
    j = i - 1;
    selected = a[i];
    loc = binarySearch(a, selected, 0, j);
    while (j >= loc) {a[j + 1] = a[j];j--;}
    a[j + 1] = selected;
  }
}
function shuffle(a){const b=[...a];for(let c=b.length-1;0<c;c--){const a=Math.floor(Math.random()*(c+1));[b[c],b[a]]=[b[a],b[c]]}return b}
const dataset = shuffle([]);

// Result: Systematic Chaos, Octavarium, Awake, Metropolis Pt. 2, Train of Thought, Six Degrees of Inner Turbulance, Black Clouds and Silver Linings, Images & Words
insertionSort(dataset,dataset.length);
alert(dataset);
alert(counter);