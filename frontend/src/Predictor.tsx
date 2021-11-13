import { Animation } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
} from "@devexpress/dx-react-chart-material-ui";
import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { VerticalBarSeriesPoint } from "react-vis";
import "./App.css";
import "./index.css";

interface IPredictResponse {
  names: string[];
  predictions: number[];
  probabilities: number[];
}

export default function Predictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<VerticalBarSeriesPoint[]>([]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    console.log(event);
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
              x: response.data.names[i],
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
        <Button variant="contained" color="primary" component="span">
          Choose Image
        </Button>
      </label>
    );
  };

  if (selectedFile && chartData.length > 0) {
    return (
      <div>
        <Box>{input()}</Box>

        <br />

        <Box>
          <Typography variant="caption">{selectedFile.name}</Typography>
        </Box>

        <br />

        <Box>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Source"
            id="placeholder"
            height={200}
          />
        </Box>

        <br />

        <Box className="results-panel">
          <Chart data={chartData} rotated>
            <ArgumentAxis />
            <BarSeries valueField="y" argumentField="x" />
            <Animation />
          </Chart>
        </Box>
      </div>
    );
  } else {
    return <div>{input()}</div>;
  }
}
