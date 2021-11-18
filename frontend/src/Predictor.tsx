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
  Link,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import axios, { AxiosError } from "axios";
import React, { ChangeEvent, useState } from "react";
import "./App.css";
import Copyright from "./Copyright";
import { API_DOMAIN } from "./environment";
import "./index.css";

interface Dictionary<T> {
  [key: string]: T;
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
  probabilityMargin: number;
  percentMargin: number;
  color: string;
}

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
    if (data[i].percent > minPercent + 0.1) {
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

export interface MarkerProps {
  // From: https://github.com/DevExpress/devextreme-reactive/blob/11e41e0a763477fdee164539f11bcb4e23c86e80/packages/dx-react-chart/src/types/plugins.legend.types.ts#L24
  color?: string;
  name?: string;
  [key: string]: unknown;
}

export class Marker extends React.PureComponent<MarkerProps> {
  render() {
    const { color, ...restProps } = this.props;
    return (
      <svg fill={color} width="10" height="10" {...restProps}>
        <circle r={5} cx={5} cy={5} {...restProps} />
      </svg>
    );
  }
}

const LegendColorCodedMarker = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);
  return (props: MarkerProps) => {
    if (props.name === undefined) {
      return <Legend.Marker {...props} />;
    } else {
      return (
        <Legend.Marker {...props} color={dataByDisplayName[props.name].color} />
      );
    }
  };
};

const LegendPercentLabel = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);

  return (props: Legend.LabelProps) => {
    return (
      <div>
        <Box marginLeft={1} component="span">
          <Typography color="textPrimary" component="span">
            <b>
              {" "}
              {" " +
                dataByDisplayName[props.text.toString()].percentMargin
                  .toFixed(1)
                  .toString() +
                "% "}
            </b>
            {props.text}
          </Typography>
        </Box>

        <Box marginLeft={1} component="span">
          <Link
            href={dataByDisplayName[props.text.toString()].wikipediaUrl}
            target="_blank"
            variant="inherit"
          >
            <Button
              variant="text"
              color="primary"
              component="span"
              size="small"
            >
              Learn More
            </Button>
          </Link>
        </Box>
      </div>
    );
  };
};

const ArgumentAxisLinkLabel = (data: IChartDataPoint[]) => {
  return (props: ArgumentAxis.LabelProps) => {
    return <ArgumentAxis.Label {...props} text={props.text} />;
  };
};

const ValueAxisPercentLabel = (props: ValueAxis.LabelProps) => {
  return <ValueAxis.Label {...props} text={props.text + "%"} />;
};

const chartDataToDictionary = (data: IChartDataPoint[]) => {
  const result: Dictionary<IChartDataPoint> = {};
  for (let i in data) {
    result[data[i].displayName] = data[i];
  }
  return result;
};

const PieSeriesLabeledPoint = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);
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

  return (props: PieSeries.PointProps) => {
    const { startAngle, endAngle, maxRadius, arg, val } = props;

    const { x, y } = getCoordinates(startAngle, endAngle, maxRadius * 0.8);
    return (
      <React.Fragment>
        <PieSeries.Point
          {...props}
          color={dataByDisplayName[props.argument].color}
        />
        <Chart.Label
          x={arg + x}
          y={val - y}
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {dataByDisplayName[props.argument].percentMargin
            .toFixed(1)
            .toString() + "%"}
        </Chart.Label>
      </React.Fragment>
    );
  };
};

const BarSeriesColorCodedPoint = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);

  return (props: BarSeries.PointProps) => {
    const { arg, val } = props;
    return (
      <React.Fragment>
        <BarSeries.Point
          {...{ ...props, color: dataByDisplayName[props.argument].color }}
        />
        <Chart.Label
          x={val > 30 ? val - 1 : val + 1}
          y={arg}
          dominantBaseline="mathematical"
          textAnchor={val > 30 ? "end" : "start"}
        >
          {" " +
            dataByDisplayName[props.argument].percent.toFixed(1).toString() +
            "%"}
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

      const file = event.target.files[0];
      setSelectedFile(file);

      // We post the file as formData object
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

  // const hasChartData = () => {
  //   return Boolean();
  // };

  // // Check if mobile device
  // const theme: Theme = useTheme();
  // const isSmallScreen = useMediaQuery(() => {
  //   return theme.breakpoints.down("xs");
  // });
  // const body = () => {
  if (!selectedFile) {
    return (
      <div>
        <Container className={classes.container}>
          <Box
            className={classes.outerBox}
            // justifyContent="center"
            // display="flex"
            // alignItems="center"
            textAlign="center"
          >
            {input()}
            <Typography>
              Submit an image of a building to predict the architectural style!
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
              <Grid justifyContent="flex-start">
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
              </Grid>
            </Box>
          </Paper>
        </Container>
        <Copyright />
      </div>
    );
  }
  // };

  // return (
  //   <div>
  //     <Container className={classes.container}>
  //       <Box
  //         className={classes.outerBox}
  //         // justifyContent="center"
  //         // display="flex"
  //         // alignItems="center"
  //         textAlign="center"
  //       >
  //         {body()}
  //       </Box>
  //     </Container>
  //     <Box className={classes.stickToBottom}>
  //       <Copyright />
  //     </Box>
  //   </div>
  // );
}
