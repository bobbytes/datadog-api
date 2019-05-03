import { MetricTypeEnum } from '../enums/metric-type.enum';
import { TTimeSeriesPoints } from '../types/time-series-points.type';

export interface IMetric {
  metric: string;
  points: TTimeSeriesPoints[];
  type?: MetricTypeEnum;
  interval?: number;
  host?: string;
  tags?: string[];
}
