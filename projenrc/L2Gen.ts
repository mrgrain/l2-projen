
import { AugmentationGenerator } from '@aws-cdk/cfn2ts/lib/augmentation-generator';
import { CannedMetricsGenerator } from '@aws-cdk/cfn2ts/lib/canned-metrics-generator';
import CodeGenerator from '@aws-cdk/cfn2ts/lib/codegen';
import * as cfnSpec from '@aws-cdk/cfnspec';
import { Component, Project } from 'projen';

export interface L2BaseOptions {
  moduleName: string;
  scope: string;
  outdir?: string;
}

export class L2Gen extends Component {
  public readonly outdir: string;
  protected gen: CodeGenerator;
  protected augs: AugmentationGenerator;
  protected canned: CannedMetricsGenerator;

  public constructor(project: Project, { moduleName, scope, outdir = 'gen' }: L2BaseOptions) {
    super(project);
    this.outdir = outdir;

    const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
    const affix = '';
    const name = moduleName.substring(4);

    this.gen = new CodeGenerator(name, spec, affix, {
      level: 2,
      resourceProviderSchema: cfnSpec.kinesisStreamResourceProviderSchema(),
    });

    this.augs = new AugmentationGenerator(name, spec, affix);


    this.canned = new CannedMetricsGenerator(name, scope);

  }

  public async synthesize() {
    this.gen.emitCode();
    await this.gen.save(this.outdir);

    if (this.augs.emitCode()) {
      await this.augs.save(this.outdir);
    }

    if (this.canned.generate()) {
      await this.canned.save(this.outdir);
    }
  }
}