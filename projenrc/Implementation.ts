export interface BaseImplementationOptions {
  defaults: {[key in string]: any};
}

export interface IImplementation {
  readonly resourceName: string;
}

export abstract class BaseImplementation implements IImplementation {
  public readonly resourceName: string = '';
  protected readonly options: BaseImplementationOptions;

  public constructor(options: BaseImplementationOptions) {
    this.options = options;
  }
}