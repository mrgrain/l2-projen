import { basename, join, relative } from 'path';
import { TextFile } from 'projen';

import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import { Cfn2Ts } from './Cfn2Ts';
import { FixedCannedMetrics } from './FixedCannedMetrics';


export interface L2ConstructProjectOptions extends Omit<TypeScriptProjectOptions, 'name' | 'defaultReleaseBranch'> {
  moduleName: string;
  scope: string;
  defaultReleaseBranch?: string;
}
export class L2ConstructProject extends TypeScriptProject {
  public readonly shortName: string;
  public readonly moduleName: string;
  public readonly scope: string;

  protected fixedCannedMetrics?: FixedCannedMetrics;

  public constructor(options: L2ConstructProjectOptions) {
    super({
      name: '@aws-cdk/' + options.moduleName + '-l2',
      defaultReleaseBranch: 'main',
      projenrcTs: true,
      srcdir: 'lib',
      libdir: 'dist',
      ...options,
      devDeps: (options.devDeps ?? []).concat(
        'awslint@0.0.0',
        'case',
        'constructs@^10',
        'ts-morph',
        '@aws-cdk/cfn2ts@0.0.0',
        '@aws-cdk/cfnspec@0.0.0',
      ),
      scripts: {
        buildup: '../../../scripts/buildup',
      },
      github: false,
      eslint: false,
    });

    this.shortName = options.moduleName.substring(4);
    this.moduleName = options.moduleName;
    this.scope = options.scope;

    const { l1Generated, l2Generated, cannedMetricsGenerated } = new Cfn2Ts(this, {
      moduleName: options.moduleName,
      scope: options.scope,
      outdir: this.srcdir,
    });

    const exportFile = new TextFile(this, join(this.srcdir, 'index.ts'), {});
    exportFile.addLine('');
    exportFile.addLine(`// ${options.scope} CloudFormation Resources:`);
    exportFile.addLine(`export * from './${basename(relative(this.srcdir, l1Generated), '.ts')}';`);
  }

  public fixMetrics(defaultDimensionsType: string): FixedCannedMetrics {
    if (!this.fixedCannedMetrics) {
      this.fixedCannedMetrics = new FixedCannedMetrics(this, {
        defaultDimensionsType,
      });
    }

    return this.fixedCannedMetrics;
  }
}