import { Animation } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
} from "@devexpress/dx-react-chart-material-ui";
import { Box, Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { VerticalBarSeriesPoint } from "react-vis";
import "./App.css";
import "./index.css";
import { CLASS_NAMES } from "./settings";

interface IPredictResponse {
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
    return (
      <div>
        <Box width="80%" p={2} m="2rem" mx="auto">
          <Paper elevation={8}>
            <Box p={2}>
              <Typography component="h5" variant="h5">
                Architecture Recognizer
              </Typography>
            </Box>

            <Box className="image-panel">
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
            </Box>

            <Box p={2} className="results-panel">
              <Chart data={chartData} rotated>
                <ArgumentAxis />
                <BarSeries valueField="y" argumentField="x" />
                <Animation />
              </Chart>
            </Box>
          </Paper>
        </Box>
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
