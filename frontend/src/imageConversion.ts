export function imageToArray({
  image,
  width,
  height,
}: {
  image: HTMLImageElement;
  width: number;
  height: number;
}): Array<Array<Array<number>>> | null {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.imageSmoothingEnabled = false;
  context.drawImage(image, 0, 0);

  const imageData: ImageData = context.getImageData(0, 0, width, height);

  const step = 4;
  let pixel = 0;
  let imageArray = [];
  let rowArray;
  for (let row = 0; row < imageData.height; row += 1) {
    rowArray = [];
    for (let col = 0; col < imageData.width * step; col += step) {
      rowArray.push([
        imageData.data[pixel],
        imageData.data[pixel + 1],
        imageData.data[pixel + 2],
      ]);
      pixel += step;
    }
    imageArray.push(rowArray);
  }
  return imageArray;
}
