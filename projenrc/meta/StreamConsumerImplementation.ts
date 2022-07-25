import { BaseImplementation, BaseImplementationOptions } from '../Implementation';

interface StreamConsumerImplementationOptions extends BaseImplementationOptions {
}

export class StreamConsumerImplementation extends BaseImplementation {
  readonly resourceName: string = 'CfnStreamConsumer';

  constructor(options: StreamConsumerImplementationOptions) {
    super(options);
  }
}
