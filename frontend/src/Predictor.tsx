import { Stack, ValueScale } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Title,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
// import { LineProps } from "@devexpress/dx-react-chart-material-ui/ValueAxis";
import { Box, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import "./App.css";
import "./index.css";

interface IPredictResponse {
  names: string[];
  predictions: number[];
  probabilities: number[];
}
interface IProbabilityChartDataPoint {
  name: string;
  probability: number;
  percentage: number;
}

const Label = (symbol: string) => (props: ValueAxis.LabelProps) => {
  return <ValueAxis.Label {...props} text={props.text + symbol} />;
};
const PercentLabel = Label("%");

export default function Predictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<IProbabilityChartDataPoint[]>([]);

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
          const probs: IProbabilityChartDataPoint[] = [];
          for (let i = 0; i < response.data.predictions.length; i++) {
            probs.push({
              name: response.data.names[i],
              probability: response.data.probabilities[i],
              percentage: response.data.probabilities[i] * 100,
            });
          }
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
  const percentages = Object.values(chartData).map((i) => i.percentage);
  const adjustDomain = ([start, end]: any) => {
    return [
      Math.floor(Math.min(...percentages)),
      Math.ceil(Math.max(...percentages)),
    ];
  };

  if (selectedFile && chartData.length > 0) {
    const sortedChartData: Object[] = [];
    for (let i in chartData) {
      const { percentage } = chartData[i];
      const thisItem = {
        ...chartData[i],
        ...{ significant: 0.5, insignificant: 0.5 },
      };
      if (percentage > Math.min(...percentages)) {
        thisItem.significant = percentage;
      } else {
        thisItem.insignificant = percentage;
      }
      sortedChartData[i] = thisItem;
    }

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
          <Chart data={sortedChartData} rotated>
            <Title text="Probabilities" />
            <ValueScale name="probability" modifyDomain={adjustDomain} />
            <ArgumentAxis />
            <ValueAxis scaleName="probability" labelComponent={PercentLabel} />
            <Stack stacks={[{ series: ["insignificant", "significant"] }]} />
            <BarSeries
              valueField="insignificant"
              argumentField="name"
              scaleName="probability"
            />
            <BarSeries
              valueField="significant"
              argumentField="name"
              scaleName="probability"
            />
            {/* <Legend /> */}
          </Chart>
        </Box>
      </div>
    );
  } else {
    return <div>{input()}</div>;
  }
}
