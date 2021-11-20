export interface IModelsApiResponse {
  predictions: number[][];
}

export interface IClassItemItem {
  name: string;
  displayName: string;
  wikipediaUrl: string;
}

export interface IPredictApiResponseItem extends IClassItemItem {
  prediction: number;
  probability: number;
}

export interface IDataPoint extends IPredictApiResponseItem {
  percent: number;
}

export interface IChartDataPoint extends IDataPoint {
  probabilityMargin: number;
  percentMargin: number;
  color: string;
}
