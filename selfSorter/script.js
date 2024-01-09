let counter = 0;
function compare(a,b) {
  counter++;
  if (a===b) return 0;
  return confirm(`Is ${a} better than ${b}?`)?-1:1;
  return ((a>b)?-1:1);
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
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.middle = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) {
    return new Node(value);
  }

  if (compare(value,root.value)==1) {
    root.left = insert(root.left, value);
  } else if (value === root.value) {
    root.middle = insert(root.middle, value);
  } else {
    root.right = insert(root.right, value);
  }

  return root;
}

function traverse(root, result) {
  if (root) {
    traverse(root.left, result);
    traverse(root.middle, result);

    // Perform your costly comparison using "compareThese" function
    result.push(root.value);

    traverse(root.right, result);
  }
}

function ternarySearchTreeSort(arr) {
  let root = null;

  for (let i = 0; i < arr.length; i++) {
    root = insert(root, arr[i]);
  }

  const result = [];
  traverse(root, result);

  return result;
}
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}
function ternaryQuickSort(arr, compareStrings) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const equal = [];
  const less = [];
  const greater = [];

  for (const element of arr) {
    const cmp = compareStrings(element, pivot);
    // console.log(cmp);
    if (cmp === 0) {
      equal.push(element);
    } else if (cmp < 0) {
      less.push(element);
    } else {
      greater.push(element);
    }
  }

  return [...ternaryQuickSort(less, compareStrings), ...equal, ...ternaryQuickSort(greater, compareStrings)];
}
let a = 0;
let b = 0;
let c = 0;
let d = 0;

for (let i = 0;i<100000;i++) {
const dataset = shuffle([0,1,2,3,4,5,6,7,8,9]);

// Result: Systematic Chaos, Octavarium, Awake, Metropolis Pt. 2, Train of Thought, Six Degrees of Inner Turbulance, Black Clouds and Silver Linings, Images & Words

binaryInsertionSort(dataset)
alert(dataset.join(", "))

  
//Testing

// ternarySearchTreeSort(dataset);
// a += counter;
// counter = 0;
// mergeSort(dataset);
// c += counter;
// counter = 0;
// ternaryQuickSort(dataset,compare);
// d += counter;
// counter = 0;
// insertionSort(dataset,dataset.length);
// b += counter;
// counter = 0;
// }
// console.log("Ternary Tree:",a/100000,"Binary Insertion:",b/100000,"Merge",c/100000,"Ternary Quicksort",d/100000)