
import { AugmentationGenerator } from '@aws-cdk/cfn2ts/lib/augmentation-generator';
import { CannedMetricsGenerator } from '@aws-cdk/cfn2ts/lib/canned-metrics-generator';
import CodeGenerator from '@aws-cdk/cfn2ts/lib/codegen';
import * as cfnSpec from '@aws-cdk/cfnspec';
import { Component, FileBase, IResolver, Project } from 'projen';

export interface L2BaseOptions {
  moduleName: string;
  scope: string;
  outdir?: string;
}

export class L2Gen extends FileBase {
  public readonly outdir: string;
  protected genl1: CodeGenerator;
  protected genl2: CodeGenerator;
  protected augs: AugmentationGenerator;
  protected canned: CannedMetricsGenerator;

  public constructor(project: Project, { moduleName, scope, outdir = 'gen' }: L2BaseOptions) {
    super(project, outdir);
    this.outdir = outdir;

    const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
    const affix = '';
    const name = moduleName.substring(4);

    this.genl1 = new CodeGenerator(name, spec, affix, {
      level: 1,
      resourceProviderSchema: cfnSpec.kinesisStreamResourceProviderSchema(),
    });

    this.genl2 = new CodeGenerator(name, spec, affix, {
      level: 2,
      resourceProviderSchema: cfnSpec.kinesisStreamResourceProviderSchema(),
    });

    this.augs = new AugmentationGenerator(name, spec, affix);


    this.canned = new CannedMetricsGenerator(name, scope);

  }

  protected synthesizeContent(_resolver: IResolver): string | undefined {
    throw new Error('Method not implemented.');
  }

  public async synthesize() {
    this.genl1.emitCode();
    await this.genl1.save(this.outdir);

    this.genl2.emitCode();
    await this.genl2.save(this.outdir);

    if (this.augs.emitCode()) {
      await this.augs.save(this.outdir);
    }

    if (this.canned.generate()) {
      await this.canned.save(this.outdir);
    }
  }
}