import { KinesisMetrics as CannedMetrics } from './kinesis-canned-metrics.generated';

/**
  * This class is to consolidate all KinesisMetrics in just one place.
  *
  * Current generated canned metrics don't match the proper metrics from the service. If it is fixed
  * at the source this class can be removed and just use the generated one directly.
  */
export class KinesisMetrics {
  public static getRecordsBytesAverage(dimensions: { StreamName: string }) {
    return {
      namespace: 'AWS/Kinesis',
      metricName: 'GetRecords.Bytes',
      dimensionsMap: dimensions,
      statistic: 'Average',
    };
  }
}
