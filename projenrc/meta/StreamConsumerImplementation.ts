import * as source from 'aws-cdk-lib/aws-kinesis';
import { BaseImplementation, BaseImplementationOptions } from '../Implementation';

export interface StreamConsumerImplementationOptions extends BaseImplementationOptions {
  props: {[key in keyof source.CfnStreamConsumerProps]: any};
}

export class StreamConsumerImplementation extends BaseImplementation {
  readonly resourceName: string = 'CfnStreamConsumer';

  constructor(options: StreamConsumerImplementationOptions) {
    super(options);
  }
}
