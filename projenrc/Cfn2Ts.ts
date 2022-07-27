
import { join } from 'path';
import { AugmentationGenerator } from '@aws-cdk/cfn2ts/lib/augmentation-generator';
import { CannedMetricsGenerator } from '@aws-cdk/cfn2ts/lib/canned-metrics-generator';
import CodeGenerator from '@aws-cdk/cfn2ts/lib/codegen';
import * as cfnSpec from '@aws-cdk/cfnspec';
import { FileBase, IResolver, Project } from 'projen';

export interface Cfn2TsOptions {
  moduleName: string;
  scope: string;
  outdir?: string;
}

export class Cfn2Ts extends FileBase {
  public readonly outdir: string;

  public readonly l1Generated: string;
  public readonly l2Generated: string;
  public readonly cannedMetricsGenerated: string;

  protected genl1: CodeGenerator;
  protected genl2: CodeGenerator;
  protected augs: AugmentationGenerator;
  protected canned: CannedMetricsGenerator;

  public constructor(project: Project, { moduleName, scope, outdir = 'gen' }: Cfn2TsOptions) {
    super(project, outdir);
    this.outdir = outdir;

    const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
    const affix = '';
    const name = moduleName.substring(4);

    this.l1Generated = join(outdir, `${name}.generated.ts`);
    this.genl1 = new CodeGenerator(name, spec, affix, {
      level: 1,
      resourceProviderSchema: cfnSpec.kinesisStreamResourceProviderSchema(),
    });

    this.l2Generated = join(outdir, `${name}.l2.generated.ts`);
    this.genl2 = new CodeGenerator(name, spec, affix, {
      level: 2,
      resourceProviderSchema: cfnSpec.kinesisStreamResourceProviderSchema(),
    });


    this.augs = new AugmentationGenerator(name, spec, affix);

    this.cannedMetricsGenerated = join(outdir, `${name}-canned-metrics.generated.ts`);
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