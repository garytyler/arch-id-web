export default function imageToArray(
  image: HTMLImageElement,
  width: number,
  height: number
): number[][][] | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.imageSmoothingEnabled = false;
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
