import { Stack, ValueScale } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Legend,
  PieSeries,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Box, Button, Typography } from "@material-ui/core";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import "./App.css";
import "./index.css";

interface IPredictResponse {
  names: string[];
  predictions: number[];
  probabilities: number[];
}

interface IDataPoint {
  name: string;
  probability: number;
  percentage: number;
}

interface IChartDataPoint extends IDataPoint {
  significant: number;
  insignificant: number;
}

interface Dictionary<T> {
  [key: string]: T;
}

const getSignificantPercentages = (data: IDataPoint[]): Dictionary<number> => {
  const percentages = Object.values(data).map((i) => i.percentage);
  const minPercentage = Math.min(...percentages);
  const significantTotal = percentages
    .filter((i) => i > minPercentage)
    .map((i) => i - minPercentage)
    .reduce((a, b) => a + b);
  const result: Dictionary<number> = {};
  for (let i in data) {
    const significantPercentage = data[i].percentage - minPercentage;
    const name: string = data[i].name;
    result[name] = (significantPercentage / significantTotal) * 100;
  }
  return result;
};

const LegendPercentNameLabel = (data: IDataPoint[]) => {
  const significantPercentages = getSignificantPercentages(data);
  return (props: Legend.LabelProps) => {
    return (
      <Legend.Label
        {...props}
        text={
          significantPercentages[props.text.toString()].toFixed(1).toString() +
          "% " +
          props.text
        }
      />
    );
  };
};

const ValueAxisSymbolLabel =
  (symbol: string) => (props: ValueAxis.LabelProps) => {
    return <ValueAxis.Label {...props} text={props.text + symbol} />;
  };
const ValueAxisPercentLabel = ValueAxisSymbolLabel("%");

const getCoordinates = (
  startAngle: number,
  endAngle: number,
  maxRadius: number
) => {
  const angle = startAngle + (endAngle - startAngle) / 2;
  const indent = 10;
  return {
    x: (maxRadius + indent) * Math.sin(angle),
    y: (maxRadius + indent) * Math.cos(angle),
  };
};

const PieSeriesLabeledPoint = (data: IDataPoint[]) => {
  const significantPercentages = getSignificantPercentages(data);

  return (props: PieSeries.PointProps) => {
    console.log(props);
    const { startAngle, endAngle, maxRadius, arg, val, value } = props;
    const { x, y } = getCoordinates(startAngle, endAngle, maxRadius);

    return (
      <React.Fragment>
        <PieSeries.Point {...props} />
        <Chart.Label
          x={arg + x}
          y={val - y}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {props.argument +
            " (" +
            significantPercentages[props.argument].toFixed(1).toString() +
            "%)"}
        </Chart.Label>
      </React.Fragment>
    );
  };
};

export default function Predictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [data, setChartData] = useState<IDataPoint[]>([]);

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
          const probs: IDataPoint[] = [];
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

  const adjustDomain = () => {
    const percentages = Object.values(data).map((i) => i.percentage);
    return [
      Math.floor(Math.min(...percentages)),
      Math.ceil(Math.max(...percentages)),
    ];
  };

  if (selectedFile && data.length > 0) {
    const percentages = Object.values(data).map((i) => i.percentage);
    const predictionData: IChartDataPoint[] = [];
    const probabilityData: IChartDataPoint[] = [];
    for (let i in data) {
      const { percentage } = data[i];
      const chartDataItem = {
        ...data[i],
        ...{ significant: 0, insignificant: 0 },
      };
      if (percentage > Math.min(...percentages) + 0.1) {
        chartDataItem.significant = percentage;
        predictionData.push(chartDataItem);
      } else {
        chartDataItem.insignificant = percentage;
      }
      probabilityData[i] = chartDataItem;
    }

    return (
      <div>
        <Box>{input()}</Box>
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
          <Typography variant="h5" align="left">
            Prediction
          </Typography>

          <Chart data={predictionData}>
            <PieSeries
              valueField="probability"
              argumentField="name"
              pointComponent={PieSeriesLabeledPoint(data)}
            />
            <Legend
              position="top"
              labelComponent={LegendPercentNameLabel(data)}
            />
          </Chart>

          <br />
          <Typography variant="h5" align="left">
            Probabilities
          </Typography>
          <Chart data={probabilityData} rotated>
            <ValueScale name="probability" modifyDomain={adjustDomain} />
            <ArgumentAxis />
            <ValueAxis
              scaleName="probability"
              labelComponent={ValueAxisPercentLabel}
            />
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
          </Chart>
        </Box>
      </div>
    );
  } else {
    return <div>{input()}</div>;
  }
}
