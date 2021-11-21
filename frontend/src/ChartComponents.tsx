import {
  ArgumentAxis,
  BarSeries,
  Chart,
  Legend,
  PieSeries,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { Box, Button, Link, Typography } from "@material-ui/core";
import { default as React } from "react";
import "./App.css";
import "./index.css";
import { IChartDataPoint } from "./types";

interface Dictionary<T> {
  [key: string]: T;
}

const chartDataToDictionary = (data: IChartDataPoint[]) => {
  const result: Dictionary<IChartDataPoint> = {};
  for (let i in data) {
    result[data[i].displayName] = data[i];
  }
  return result;
};

interface MarkerProps {
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

export const LegendColorCodedMarker = (data: IChartDataPoint[]) => {
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

export const LegendPercentLabel = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);

  return (props: Legend.LabelProps) => {
    return (
      <div>
        <Box marginLeft={1} marginRight={0} paddingX={0} component="span">
          <Typography variant="body2" color="textPrimary" component="span">
            <b>
              {" " +
                dataByDisplayName[props.text.toString()].percentMargin
                  .toFixed(1)
                  .toString() +
                "% "}
            </b>
            {props.text}
          </Typography>
        </Box>

        <Box marginLeft={0} paddingLeft={0} component="span">
          <Link
            href={dataByDisplayName[props.text.toString()].wikipediaUrl}
            target="_blank"
            variant="inherit"
          >
            <Button
              style={{ paddingRight: 0, marginRight: 0 }}
              variant="text"
              color="primary"
              component="span"
              size="small"
            >
              {" "}
              Learn More
            </Button>
          </Link>
        </Box>
      </div>
    );
  };
};

export const ArgumentAxisLinkLabel =
  (data: IChartDataPoint[]) => (props: ArgumentAxis.LabelProps) => {
    return <ArgumentAxis.Label {...props} text={props.text} />;
  };

export const ValueAxisPercentLabel = (props: ValueAxis.LabelProps) => {
  if (Number(props.text) % 1 !== 0) {
    return null;
  }

  return (
    <ValueAxis.Label {...props} text={Number(props.text).toString() + "%"} />
  );
};

export const PieSeriesLabeledPoint = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);

  let maxDataPoint: IChartDataPoint = data[0];
  for (let n = 1; n < data.length; n++) {
    if (data[n].percentMargin > maxDataPoint.percentMargin) {
      maxDataPoint = data[n];
    }
  }

  const getLabelCoordinates = (
    startAngle: number,
    endAngle: number,
    maxRadius: number,
    arg: number,
    val: number
  ) => {
    const angle = startAngle + (endAngle - startAngle) / 2;
    const indent = maxRadius / -2;
    const x = arg + (maxRadius + indent) * Math.sin(angle);
    const y = val - (maxRadius + indent) * Math.cos(angle);
    return {
      x: x,
      y: y,
    };
  };
  return (props: PieSeries.PointProps) => {
    const { startAngle, endAngle, maxRadius, arg, val } = props;
    const { x, y } = getLabelCoordinates(
      startAngle,
      endAngle,
      maxRadius,
      arg,
      val
    );
    return (
      <React.Fragment>
        <PieSeries.Point
          {...props}
          maxRadius={maxRadius * 1.1}
          color={dataByDisplayName[props.argument].color}
        />
        <Chart.Label x={x} y={y} dominantBaseline="middle" textAnchor="middle">
          {dataByDisplayName[props.argument] === maxDataPoint
            ? dataByDisplayName[props.argument].percentMargin
                .toFixed(1)
                .toString() +
              "% " +
              dataByDisplayName[props.argument].displayName
            : ""}
        </Chart.Label>
      </React.Fragment>
    );
  };
};

export const BarSeriesColorCodedPoint = (data: IChartDataPoint[]) => {
  const dataByDisplayName = chartDataToDictionary(data);
  let maxDataPoint: IChartDataPoint = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i].percent > maxDataPoint.percent) {
      maxDataPoint = data[i];
    }
  }

  return (props: BarSeries.PointProps) => {
    const { arg, val } = props;
    return (
      <React.Fragment>
        <BarSeries.Point
          {...{ ...props, color: dataByDisplayName[props.argument].color }}
        />
        <Chart.Label
          x={
            dataByDisplayName[props.argument].percent > maxDataPoint.percent / 2
              ? val - 1
              : val + 1
          }
          y={arg}
          dominantBaseline="mathematical"
          textAnchor={
            dataByDisplayName[props.argument].percent > maxDataPoint.percent / 2
              ? "end"
              : "start"
          }
        >
          {" " +
            dataByDisplayName[props.argument].percent.toFixed(1).toString() +
            "%"}
        </Chart.Label>
      </React.Fragment>
    );
  };
};
