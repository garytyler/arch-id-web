import { ChangeEvent, useState } from "react";
import "./App.css";

function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      setSelectedFile(event.target.files[0]);

      const image = new Image(299, 299);
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = () => {
        if (context) {
          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, 299, 299);
          // document.getElementById("placehere")?.appendChild(image);
          document.body.appendChild(image);
          console.log(imageData);
        }
      };
    }
  };

  const input = () => {
    return <input type="file" onChange={changeHandler} />;
  };

  if (selectedFile) {
    return (
      <div>
        {input()}
        <br />
        <h2>File Details:</h2>
        <p>File Name: {selectedFile.name}</p>
        <p>File Type: {selectedFile.type}</p>
        <p>FileSize: {selectedFile.size}</p>
        <p>Last Modified: {selectedFile.lastModified.toLocaleString()}</p>
        <img alt="Source" id="placeholder"></img>
      </div>
    );
  } else {
    return (
      <div>
        {input()}
        <br />
        <h4>Choose before Pressing the Upload button</h4>
      </div>
    );
  }
}

function App() {
  return <div className="App">{Main()}</div>;
}

export default App;
