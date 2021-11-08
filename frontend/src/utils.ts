export function softmax(arr: number[]) {
  const C = Math.max(...arr);
  const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
  return arr.map((value, index) => {
    return Math.exp(value - C) / d;
  });
}

export function argmax(arr: number[]) {
  let maxValue: number = 0;
  let maxIndex: number = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }
  return maxIndex;
}

export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
