import { ChangeEvent, useState } from "react";
import "./App.css";
import imageToArray from "./image-conversion";

const STYLE_KEY: string[] = [
  "Achaemenid",
  "American Foursquare",
  "American craftsman style",
  "Ancient Egyptian",
  "Art Deco",
  "Art Nouveau",
  "Baroque",
  "Bauhaus",
  "Beaux-Arts",
  "Byzantine",
  "Chicago school",
  "Colonial",
  "Deconstructivism",
  "Edwardian",
  "Georgian",
  "Gothic",
  "Greek Revival",
  "International style",
  "Novelty",
  "Palladian",
  "Postmodern",
  "Queen Anne",
  "Romanesque",
  "Russian Revival",
  "Tudor Revival",
];

interface IPredictResponse {
  predictions: Array<Array<number>>;
}

interface IResult {
  style: string;
  src: string;
}

function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<IResult | null>(null);

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      setSelectedFile(event.target.files[0]);

      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = () => {
        let imageArray = imageToArray(image, 299, 299);
        if (imageArray === null) return;
        let expImageArray = [imageArray];

        fetch("http://localhost:8501/v1/models/InceptionResNet:predict", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature_name: "serving_default",
            instances: expImageArray,
          }),
        })
          .then((res) => res.json())
          .then((res: IPredictResponse) => {
            for (let n in res["predictions"][0]) {
              if (res["predictions"][0][n] === 1.0) {
                console.log(STYLE_KEY[n]);
                setResult({ style: STYLE_KEY[n], src: image.src });
                return;
              }
            }
          })
          .catch((err) => console.error(err));
      };
    }
  };

  const input = () => {
    return <input type="file" onChange={changeHandler} />;
  };

  if (selectedFile) {
    return (
      <div>
        <br />
        {input()}
        <br />
        <h3>File Details:</h3>
        <pre>File Name: {selectedFile.name}</pre>
        <pre>File Type: {selectedFile.type}</pre>
        <pre>File Size: {selectedFile.size}</pre>
        <h2>Result:</h2>
        <h1>{result?.style}</h1>
        <img src={result?.src} alt="Source" id="placeholder"></img>
      </div>
    );
  } else {
    return (
      <div>
        <br />
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
