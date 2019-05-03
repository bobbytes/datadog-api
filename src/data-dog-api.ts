import { Rest } from './helpers/rest';
import { IDatadogOptions } from './interfaces/datadog-options.interface';
import { IMetric } from './interfaces/metric-interface';
import { IMetricsResponse } from './interfaces/metrics-response.interface';
import { ISimpleMetric } from './interfaces/simple-metric.interface';

export class DatadogApi {
  private rest: Rest;

  constructor(private config: IDatadogOptions) {
    const host = config.host || 'app.datadoghq.com';

    this.rest = new Rest({
      host: `https://${host}/api/v1`,
      query: { api_key: config.apiKey, application_key: config.appKey },
    });
  }

  public getMetrics(from: string): Promise<IMetricsResponse> {
    return this.rest.get('/metrics', { from });
  }

  public postMetric(metric: ISimpleMetric): Promise<any> {
    const timeStamp = new Date().getTime() / 1000;
    const { metric: metricKey, value, type, interval, tags, host } = metric;

    const mappedMetric: IMetric = {
      metric: metricKey, type, interval, tags, host, points: [[timeStamp, value]],
    };

    const metricsWithAdditionalTags = this.addConfigTagsToMetrics([mappedMetric]);

    return this.postMetrics(metricsWithAdditionalTags);
  }

  public postMetrics(metrics: IMetric[]): Promise<any> {
    const metricsWithAdditionalTags = this.addConfigTagsToMetrics(metrics);
    const metricsBody = JSON.stringify({ series: metricsWithAdditionalTags });
    return this.rest.post('/series', metricsBody);
  }

  private addConfigTagsToMetrics(metrics: IMetric[]): IMetric[] {
    return metrics.map(metric => ({ ...metric, tags: [...metric.tags || [], ...this.config.tags || []] }));
  }
}
