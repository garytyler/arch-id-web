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
import { ChangeEvent, default as React, useState } from "react";
import "./App.css";
import Copyright from "./Copyright";
import { PREDICT_API_URL } from "./environment";
import "./index.css";
import { imageToArray, softmax } from "./utils";

interface Dictionary<T> {
  [key: string]: T;
}

interface IModelsApiResponse {
  predictions: number[][];
}

interface IClassItemItem {
  name: string;
  displayName: string;
  wikipediaUrl: string;
}

interface IPredictApiResponseItem extends IClassItemItem {
  prediction: number;
  probability: number;
}

interface IDataPoint extends IPredictApiResponseItem {
  percent: number;
}

interface IChartDataPoint extends IDataPoint {
  probabilityMargin: number;
  percentMargin: number;
  color: string;
}

const CLASSES: IClassItemItem[] = [
  {
    name: "Achaemenid architecture",
    displayName: "Achaemenid",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Achaemenid_architecture",
  },
  {
    name: "American craftsman style",
    displayName: "American Craftsman",
    wikipediaUrl: "https://en.wikipedia.org/wiki/American_Craftsman",
  },
  {
    name: "American Foursquare architecture",
    displayName: "American Foursquare",
    wikipediaUrl: "https://en.wikipedia.org/wiki/American_Foursquare",
  },
  {
    name: "Ancient Egyptian architecture",
    displayName: "Ancient Egyptian",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Ancient_Egyptian_architecture",
  },
  {
    name: "Art Deco architecture",
    displayName: "Art Deco",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Art_Deco",
  },
  {
    name: "Art Nouveau architecture",
    displayName: "Art Nouveau",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Art_Nouveau",
  },
  {
    name: "Baroque architecture",
    displayName: "Baroque",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Baroque_architecture",
  },
  {
    name: "Bauhaus architecture",
    displayName: "Bauhaus",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bauhaus",
  },
  {
    name: "Beaux-Arts architecture",
    displayName: "Beaux-Arts",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Beaux-Arts_architecture",
  },
  {
    name: "Byzantine architecture",
    displayName: "Byzantine",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Byzantine_architecture",
  },
  {
    name: "Chicago school architecture",
    displayName: "Chicago school",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Chicago_school_(architecture)",
  },
  {
    name: "Colonial architecture",
    displayName: "Colonial",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Colonial_architecture",
  },
  {
    name: "Deconstructivism",
    displayName: "Deconstructivism",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Deconstructivism",
  },
  {
    name: "Edwardian architecture",
    displayName: "Edwardian",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Edwardian_architecture",
  },
  {
    name: "Georgian architecture",
    displayName: "Georgian",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Georgian_architecture",
  },
  {
    name: "Gothic architecture",
    displayName: "Gothic",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Gothic_architecture",
  },
  {
    name: "Greek Revival architecture",
    displayName: "Greek Revival",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Greek_Revival_architecture",
  },
  {
    name: "International style",
    displayName: "International Style",
    wikipediaUrl:
      "https://en.wikipedia.org/wiki/International_Style_(architecture)",
  },
  {
    name: "Novelty architecture",
    displayName: "Novelty",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Novelty_architecture",
  },
  {
    name: "Palladian architecture",
    displayName: "Palladian",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Palladian_architecture",
  },
  {
    name: "Postmodern architecture",
    displayName: "Postmodern",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Postmodern_architecture",
  },
  {
    name: "Queen Anne architecture",
    displayName: "Queen Anne",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Queen_Anne_style_architecture",
  },
  {
    name: "Romanesque architecture",
    displayName: "Romanesque",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Romanesque_architecture",
  },
  {
    name: "Russian Revival architecture",
    displayName: "Russian Revival",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Russian_Revival_architecture",
  },
  {
    name: "Tudor Revival architecture",
    displayName: "Tudor Revival",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Tudor_Revival_architecture",
  },
];

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
  // const body = () => {
  if (!selectedFile) {
    return (
      <div>
        <Container className={classes.container}>
          <Box className={classes.outerBox} textAlign="center">
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
