import { Box, Button, Container } from "@mui/material";
import axios from "axios";
import * as React from "react";
import { ChangeEvent, useState } from "react";
import {
  FlexibleXYPlot,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesPoint,
  VerticalGridLines,
  XAxis,
  YAxis,
} from "react-vis";
import "./App.css";
import "./index.css";
import { CLASS_NAMES } from "./settings";

interface IPredictResponse {
  predictions: number[];
  probabilities: number[];
}

function Main() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<VerticalBarSeriesPoint[]>([]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an object of formData
      const formData = new FormData();
      formData.append("files", file);

      axios
        .post<IPredictResponse>(
          `http://localhost:8000/predict/InceptionResNetV2-imagenet`,
          formData,
          { headers: { "content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          const probs: VerticalBarSeriesPoint[] = [];
          console.log(response.data);
          for (let i = 0; i < response.data.predictions.length; i++) {
            probs.push({
              y: response.data.probabilities[i],
              x: CLASS_NAMES[i],
            });
          }
          console.log(probs);
          setChartData(probs);
        })
        .catch((error) => console.error(error));
    }
  };

  const input = () => {
    return (
      <label htmlFor="btn-upload">
        <input
          id="btn-upload"
          name="btn-upload"
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={changeHandler}
        />
        <Button className="btn-choose" variant="outlined" component="span">
          Choose Image
        </Button>
      </label>
    );
  };

  if (selectedFile && chartData.length > 0) {
    console.log(chartData);
    return (
      <Container>
        <Box>
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

            <Box sx={{ flexWrap: "wrap" }}>
              <FlexibleXYPlot
                margin={{ bottom: 70 }}
                xType="ordinal"
                width={900}
                height={300}
              >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickLabelAngle={-45} />
                <YAxis />
                <VerticalBarSeries
                  barWidth={0.9}
                  data={chartData}
                  // data={[
                  //   { x: "Apples", y: 12 },
                  //   { x: "Bananas", y: 2 },
                  //   { x: "Cranberries", y: 11 },
                  // ]}
                />
              </FlexibleXYPlot>
            </Box>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Source"
              id="placeholder"
            ></img>
          </div>
        </Box>
      </Container>
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
  // return <Button variant="contained">Hello World</Button>;
}

export default App;
