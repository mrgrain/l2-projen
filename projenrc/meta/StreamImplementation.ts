import { BaseImplementation, BaseImplementationOptions } from '../Implementation';

interface StreamImplementationOptions extends BaseImplementationOptions {
}

export class StreamImplementation extends BaseImplementation {
  readonly resourceName: string = 'CfnStream';

  constructor(options: StreamImplementationOptions) {
    super(options);
  }
}
