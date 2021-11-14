import { Stack, ValueScale } from "@devexpress/dx-react-chart";
import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Legend,
  PieSeries,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PhotoCamera } from "@material-ui/icons";
import axios, { AxiosError } from "axios";
import React, { ChangeEvent, useState } from "react";
import "./App.css";
import Copyright from "./Copyright";
import { API_DOMAIN } from "./env";
import "./index.css";

interface Dictionary<T> {
  [key: string]: T;
}

interface IPredictResponse {
  names: string[];
  predictions: number[];
  probabilities: number[];
}

interface IPredictResponseItem {
  prediction: number;
  probability: number;
  name: string;
  displayName: string;
  wikipediaUrl: string;
}

interface IDataPoint extends IPredictResponseItem {
  percent: number;
}

interface IChartDataPoint extends IDataPoint {
  significant: number;
  insignificant: number;
  significantMargin: number;
  insignificantMargin: number;
}

const createChartData = (data: IDataPoint[]): IChartDataPoint[] => {
  const percents = Object.values(data).map((i) => i.percent);
  const minPercent = Math.min(...percents);
  const signifTotal = percents
    .filter((i) => i > minPercent)
    .map((i) => i - minPercent)
    .reduce((a, b) => a + b);
  const result: IChartDataPoint[] = [];
  for (let i in data) {
    const percentMargin = ((data[i].percent - minPercent) / signifTotal) * 100;
    if (data[i].percent > minPercent + 0.1) {
      result[i] = {
        ...data[i],
        ...{
          significant: data[i].percent,
          insignificant: 0,
          significantMargin: percentMargin,
          insignificantMargin: 0,
        },
      };
    } else {
      result[i] = {
        ...data[i],
        ...{
          significant: 0,
          insignificant: data[i].percent,
          significantMargin: 0,
          insignificantMargin: percentMargin,
        },
      };
    }
  }
  return result;
};

const LegendPercentLabel = (data: IChartDataPoint[]) => {
  const valuesByName: Dictionary<number> = {};
  for (let i in data) {
    const name: string = data[i].name;
    valuesByName[name] = data[i].significantMargin;
  }
  return (props: Legend.LabelProps) => {
    return (
      <Legend.Label
        {...props}
        text={
          props.text +
          " (" +
          valuesByName[props.text.toString()].toFixed(1).toString() +
          "%)"
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

const PieSeriesLabeledPoint = (data: IChartDataPoint[]) => {
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

  const valuesByName: Dictionary<number> = {};
  for (let i in data) {
    const name: string = data[i].name;
    valuesByName[name] = data[i].significantMargin;
  }

  return (props: PieSeries.PointProps) => {
    const { startAngle, endAngle, maxRadius, arg, val } = props;

    const { x, y } = getCoordinates(startAngle, endAngle, maxRadius * 0.8);

    return (
      <React.Fragment>
        <PieSeries.Point {...props} />
        <Chart.Label
          x={arg + x}
          y={val - y}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {valuesByName[props.argument].toFixed(1).toString() + "%"}
        </Chart.Label>
      </React.Fragment>
    );
  };
};

const useStyles = makeStyles(
  (theme: {
    spacing: (
      arg0: number,
      arg1?: number | undefined,
      arg2?: number | undefined
    ) => number;
    breakpoints: { up: (arg0: number) => any };
  }) => ({
    container: {
      paddingBottom: theme.spacing(4),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        paddingTop: theme.spacing(4),
      },
    },
    paper: {
      elevation: 10,
    },
    outerBox: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3),
      },
    },
    button: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      overflow: "auto",
    },
    stickToBottom: {
      width: "100%",
      position: "fixed",
      bottom: 0,
    },
  })
);

export default function Predictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<IChartDataPoint[]>([]);
  const classes = useStyles();

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create an object of formData
      const formData = new FormData();
      formData.append("files", file);

      axios
        .post<IPredictResponseItem[]>(
          `${window.location.protocol}//${API_DOMAIN}/api/predict/InceptionResNetV2-imagenet`,
          formData,
          { headers: { "content-Type": "multipart/form-data" } }
        )
        .then((response) => {
          const data: IDataPoint[] = [];
          for (let i = 0; i < response.data.length; i++) {
            data.push({
              prediction: response.data[i].prediction,
              probability: response.data[i].probability,
              name: response.data[i].name,
              displayName: response.data[i].displayName,
              wikipediaUrl: response.data[i].wikipediaUrl,
              percent: response.data[i].probability * 100,
            });
          }
          setChartData(createChartData(data));
        })
        .catch((error: AxiosError) => console.error(error));
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
        <Button
          // size="large"
          variant="contained"
          color="primary"
          component="span"
          startIcon={<PhotoCamera />}
        >
          Choose Image
        </Button>
      </label>
    );
  };

  const adjustDomain = () => {
    const percents = Object.values(chartData).map((i) => i.percent);
    return [
      Math.floor(Math.min(...percents)),
      Math.ceil(Math.max(...percents)),
    ];
  };

  if (selectedFile && chartData.length > 0) {
    const pieChartData = chartData.filter((i) => i.significant > 0);
    return (
      <div>
        <Container className={classes.container}>
          <Paper className={classes.paper}>
            <Box className={classes.outerBox} textAlign="center">
              <Grid alignItems="stretch" direction="column">
                <Box>{input()}</Box>
                <Box margin={1}>
                  <Typography variant="caption">{selectedFile.name}</Typography>
                </Box>

                <Box margin={1}>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Source"
                    id="placeholder"
                    height={200}
                  />
                </Box>

                <Typography variant="h5" align="left">
                  Prediction
                </Typography>

                <Chart data={pieChartData}>
                  <PieSeries
                    valueField="significantMargin"
                    argumentField="name"
                    pointComponent={PieSeriesLabeledPoint(pieChartData)}
                  />
                  <Legend
                    position="top"
                    labelComponent={LegendPercentLabel(pieChartData)}
                  />
                </Chart>

                <br />
                <Typography variant="h5" align="left">
                  Probabilities
                </Typography>
                <Chart data={chartData} rotated>
                  <ValueScale name="probability" modifyDomain={adjustDomain} />
                  <ArgumentAxis />
                  <ValueAxis
                    scaleName="probability"
                    labelComponent={ValueAxisPercentLabel}
                  />
                  <Stack
                    stacks={[{ series: ["insignificant", "significant"] }]}
                  />
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
              </Grid>
            </Box>
          </Paper>
        </Container>
        <Copyright />
      </div>
    );
  } else {
    return (
      <div>
        <Container className={classes.container}>
          <Box
            className={classes.outerBox}
            justifyContent="center"
            display="flex"
            alignItems="center"
          >
            {input()}
          </Box>
        </Container>
        <Box className={classes.stickToBottom}>
          <Copyright />
        </Box>
      </div>
    );
  }
}
