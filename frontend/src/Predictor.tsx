import { Animation, Stack, ValueScale } from "@devexpress/dx-react-chart";
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
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import { ChangeEvent, default as React, useState } from "react";
import "./App.css";
import {
  ArgumentAxisLinkLabel,
  BarSeriesColorCodedPoint,
  LegendColorCodedMarker,
  LegendPercentLabel,
  PieSeriesLabeledPoint,
  ValueAxisPercentLabel,
} from "./ChartComponents";
import { CLASSES } from "./classes";
import Copyright from "./Copyright";
import { PREDICT_API_URL } from "./environment";
import "./index.css";
import { IChartDataPoint, IDataPoint, IModelsApiResponse } from "./types";
import { imageToArray, softmax } from "./utils";

const createChartData = (data: IDataPoint[]): IChartDataPoint[] => {
  let colorIndex = 0;
  const colors = [
    "#42A5F5",
    "#FF7043",
    "#9CCC65",
    "#FFCA28",
    "#26A69A",
    "#EC407A",
  ];
  const percents = Object.values(data).map((i) => i.percent);
  const minPercent = Math.min(...percents);

  const signifTotal = percents
    .filter((i) => i > minPercent)
    .map((i) => i - minPercent)
    .reduce((a, b) => a + b);
  const result: IChartDataPoint[] = [];
  for (let i in data) {
    const margin = (data[i].percent - minPercent) / signifTotal;
    const percentMargin = margin * 100;
    if (data[i].percent > minPercent + 0.01) {
      result[i] = {
        ...data[i],
        ...{
          probabilityMargin: margin,
          percentMargin: percentMargin,
          color: colors[colorIndex],
        },
      };
      colorIndex < colors.length ? colorIndex++ : (colorIndex = 0);
    } else {
      result[i] = {
        ...data[i],
        ...{
          probabilityMargin: 0,
          percentMargin: 0,
          color: "#888888",
        },
      };
    }
  }
  return result.sort((a: IChartDataPoint, b: IChartDataPoint) =>
    a.displayName > b.displayName ? -1 : 1
  );
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
    content: {
      flexGrow: 1,
      overflow: "auto",
    },
    stickToBottom: {
      width: "100%",
      position: "fixed",
      bottom: 0,
    },
    link: {
      color: "lightblueblue",
      textDecoration: "none",
      "&:hover": {
        color: "blue",
      },
    },
  })
);

export default function Predictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartData, setChartData] = useState<IChartDataPoint[]>([]);
  const classes = useStyles();

  const changeHandler = (event: ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target?.files) {
      setChartData([]);
      loadChartDataFromPredictApi(event);
    }
  };

  const loadChartDataFromPredictApi = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // We post the file as formData object
      const formData = new FormData();
      formData.append("files", file);
      const url = `${PREDICT_API_URL}/api/predict/InceptionResNetV2-imagenet`;
      fetch(url, {
        method: "POST",
        body: formData,
        mode: "cors",
      })
        .then((res) => res.json())
        .then((response) => {
          const data: IDataPoint[] = [];
          for (let i = 0; i < response.length; i++) {
            data.push({
              prediction: response[i].prediction,
              probability: response[i].probability,
              name: response[i].response,
              displayName: response[i].displayName,
              wikipediaUrl: response[i].wikipediaUrl,
              percent: response[i].probability * 100,
            });
          }
          setChartData(createChartData(data));
        })
        .catch((error) => console.error(error));
    }
  };

  const loadChartDataFromModelsApi = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      const image = new Image();
      image.src = URL.createObjectURL(event.target.files[0]);
      image.onload = () => {
        let imageArray = imageToArray(image, 299, 299);
        if (imageArray === null) return;
        let expImageArray = [imageArray];
        const url = `${PREDICT_API_URL}/v1/models/InceptionResNetV2-imagenet:predict`;
        // const url = `http://api.architectureid.app/v1/models/InceptionResNetV2-imagenet:predict`;
        fetch(url, {
          method: "POST",
          headers: {
            "mode": "cors",
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            signature_name: "serving_default",
            instances: expImageArray,
          }),
        })
          .then((res) => res.json())
          .then((res: IModelsApiResponse) => {
            const predictions = res["predictions"][0];
            const probabilities = softmax(res["predictions"][0]);
            const data: IDataPoint[] = [];
            for (let i = 0; i < predictions.length; i++) {
              data.push({
                ...CLASSES[i],
                prediction: predictions[i],
                probability: probabilities[i],
                percent: probabilities[i] * 100,
              });
            }
            setChartData(createChartData(data));
          })
          .catch((err) => console.error(err));
      };
    }
  };
  const adjustDomain = () => {
    const percents = Object.values(chartData).map((i) => i.percent);
    return [
      Math.floor(Math.min(...percents)),
      Math.ceil(Math.max(...percents)),
    ];
  };

  const input = () => {
    return (
      <Grid item style={{ textAlign: "center" }}>
        <Box marginY={2}>
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
        </Box>
        {/* <Box height="3rem">{status()}</Box> */}
      </Grid>
    );
  };

  // // Check if mobile device
  // const theme: Theme = useTheme();
  // const isSmallScreen = useMediaQuery(() => {
  //   return theme.breakpoints.down("xs");
  // });

  if (!selectedFile) {
    return (
      <div>
        <Container className={classes.container}>
          <Box className={classes.outerBox} textAlign="center">
            {input()}
            <Typography>
              Submit an image of a structure to identify the architectural
              style.
            </Typography>
          </Box>
        </Container>
        <Box className={classes.stickToBottom}>
          <Copyright />
        </Box>
      </div>
    );
  } else if (chartData.length === 0) {
    return (
      <div>
        <Container className={classes.container}>
          <Box className={classes.outerBox} textAlign="center">
            {input()}
            <CircularProgress color="secondary" />
          </Box>
        </Container>
        <Box className={classes.stickToBottom}>
          <Copyright />
        </Box>
      </div>
    );
  } else {
    const pieChartData = chartData.filter((i) => i.probabilityMargin > 0);
    return (
      <div>
        <Container className={classes.container}>
          <Paper className={classes.paper}>
            <Box className={classes.outerBox} textAlign="center">
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
                <Animation />
                <PieSeries
                  valueField="percentMargin"
                  argumentField="displayName"
                  pointComponent={PieSeriesLabeledPoint(pieChartData)}
                />
                <Legend
                  position="top"
                  markerComponent={LegendColorCodedMarker(pieChartData)}
                  labelComponent={LegendPercentLabel(pieChartData)}
                />
              </Chart>

              <br />
              <Typography variant="h5" align="left">
                Probabilities
              </Typography>
              <Chart data={chartData} rotated>
                <Animation />
                <ValueScale name="probability" modifyDomain={adjustDomain} />
                <ArgumentAxis
                  labelComponent={ArgumentAxisLinkLabel(chartData)}
                />
                <ValueAxis
                  scaleName="probability"
                  labelComponent={ValueAxisPercentLabel}
                />
                <Stack
                  stacks={[{ series: ["insignificant", "significant"] }]}
                />
                <BarSeries
                  valueField="percent"
                  argumentField="displayName"
                  scaleName="probability"
                  pointComponent={BarSeriesColorCodedPoint(chartData)}
                />
              </Chart>
            </Box>
          </Paper>
        </Container>
        <Copyright />
      </div>
    );
  }
}
