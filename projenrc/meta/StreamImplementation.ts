import * as source from 'aws-cdk-lib/aws-kinesis';
import { BaseImplementation, BaseImplementationOptions } from '../Implementation';

export interface StreamImplementationOptions extends BaseImplementationOptions {
  props: {[key in keyof source.CfnStreamProps]: any};
}

export class StreamImplementation extends BaseImplementation {
  readonly resourceName: string = 'CfnStream';

  constructor(options: StreamImplementationOptions) {
    super(options);
  }
}
