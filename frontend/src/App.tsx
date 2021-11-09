import axios from "axios";
import { ChangeEvent, useState } from "react";
import "./App.css";
// const CLASS_NAMES: string[] = [
//   "Achaemenid",
//   "American Foursquare",
//   "American craftsman style",
//   "Ancient Egyptian",
//   "Art Deco",
//   "Art Nouveau",
//   "Baroque",
//   "Bauhaus",
//   "Beaux-Arts",
//   "Byzantine",
//   "Chicago school",
//   "Colonial",
//   "Deconstructivism",
//   "Edwardian",
//   "Georgian",
//   "Gothic",
//   "Greek Revival",
//   "International style",
//   "Novelty",
//   "Palladian",
//   "Postmodern",
//   "Queen Anne",
//   "Romanesque",
//   "Russian Revival",
//   "Tudor Revival",
// ];

// interface IPredictResponse {
//   predictions: Array<Array<number>>;
// }

// interface IResultDisplay {
//   style: string;
//   src: string;
// }

// interface IStyleScore {
//   style: string;
//   weight: number;
//   score: number;
// }
// function getBase64(file: File) {
//   var reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = function () {
//     return reader.result;
//   };
//   reader.onerror = function (error) {
//     console.log("Error: ", error);
//   };
// }
function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [result, setResult] = useState<IResultDisplay | null>(null);

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      //
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append("files", file);
      // formData.append("name", file.name);

      // Details of the uploaded file
      // console.log(this.state.selectedFile);

      axios
        .post(
          `http://localhost:8000/predict/InceptionResNetV2-imagenet`,
          formData,
          {
            headers: { "content-Type": "multipart/form-data" },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));

      // Request made to the backend api
      // Send formData object
      // axios
      //   .post("http://localhost:8000/upload", formData)
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      // const image = new Image();
      // image.src = URL.createObjectURL(file);
      // image.onload = () => {
      //   // const files = Array.from();
      //   // event.target.files.forEach((file, i) => {
      //   //   formData.append(i, file);
      //   // });
      //   // let imageArray = imageToArray(image, 299, 299);
      //   // if (imageArray === null) return;
      //   // let expImageArray = [imageArray];
      //   // fetch(
      //   //   "http://localhost:8501/v1/models/InceptionResNetV2-imagenet:predict",
      //   //   {
      //   //     method: "POST",
      //   //     headers: {
      //   //       "Accept": "application/json",
      //   //       "Content-Type": "application/json",
      //   //     },
      //   //     body: JSON.stringify({
      //   //       signature_name: "serving_default",
      //   //       instances: expImageArray,
      //   //     }),
      //   //   }
      //   // )
      //   //   .then((res) => res.json())
      //   //   .then((res: IPredictResponse) => {
      //   //     const weights = res["predictions"][0];
      //   //     const scores = softmax(res["predictions"][0]);
      //   //     const results = [];
      //   //     for (let i = 0; i < weights.length; i++) {
      //   //       const styleScore: IStyleScore = {
      //   //         style: titleCase(CLASS_NAMES[i]),
      //   //         weight: weights[i],
      //   //         score: scores[i],
      //   //       };
      //   //       results.push(styleScore);
      //   //     }
      //   //     for (let i = 0; i < results.length; i++) {
      //   //       console.log(
      //   //         i,
      //   //         results[i].style,
      //   //         results[i].score,
      //   //         results[i].weight.toFixed(5)
      //   //       );
      //   //     }
      //   //     setResult({
      //   //       style: titleCase(CLASS_NAMES[argmax(weights)]),
      //   //       src: image.src,
      //   //     });
      //   //   })
      //   //   .catch((err) => console.error(err));
      // };
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
        <pre>File Path: {selectedFile.webkitRelativePath}</pre>
        <pre>File Type: {selectedFile.type}</pre>
        <pre>File Size: {selectedFile.size}</pre>
        <h2>Result:</h2>
        {/* <h1>{result?.style}</h1> */}
        {/* <img src={result?.src} alt="Source" id="placeholder"></img> */}
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
