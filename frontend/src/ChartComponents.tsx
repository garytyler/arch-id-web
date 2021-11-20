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

export const ArgumentAxisLinkLabel = (data: IChartDataPoint[]) => {
  return (props: ArgumentAxis.LabelProps) => {
    return <ArgumentAxis.Label {...props} text={props.text} />;
  };
};

export const ValueAxisPercentLabel = (props: ValueAxis.LabelProps) => {
  return <ValueAxis.Label {...props} text={props.text + "%"} />;
};

export const PieSeriesLabeledPoint = (data: IChartDataPoint[]) => {
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

export const BarSeriesColorCodedPoint = (data: IChartDataPoint[]) => {
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
