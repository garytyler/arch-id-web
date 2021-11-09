export function imageToArray(
  image: HTMLImageElement,
  width: number,
  height: number,
  imageSmoothing: boolean = false
): number[][][] | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.imageSmoothingEnabled = imageSmoothing;
  context.drawImage(image, 0, 0, width, height);
  const imageData: ImageData = context.getImageData(0, 0, width, height);
  const step = 4;
  let pixel = 0;
  let imageArray = [];
  let rowArray;
  for (let row = 0; row < imageData.height; row += 1) {
    rowArray = [];
    for (let col = 0; col < imageData.width * step; col += step) {
      rowArray.push([
        imageData.data[pixel] / 127.5 - 1.0,
        imageData.data[pixel + 1] / 127.5 - 1.0,
        imageData.data[pixel + 2] / 127.5 - 1.0,
      ]);
      pixel += step;
    }
    imageArray.push(rowArray);
  }
  return imageArray;
}

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
