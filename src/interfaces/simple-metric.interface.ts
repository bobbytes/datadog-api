import { MetricTypeEnum } from '../enums/metric-type.enum';

export interface ISimpleMetric {
  metric: string;
  value: any;
  type?: MetricTypeEnum;
  interval?: number;
  tags?: string[];
  host?: string;
}
