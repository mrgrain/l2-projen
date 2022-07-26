import { join } from 'path';
import * as Case from 'case';
import { ClassDeclarationStructure, MethodDeclarationStructure, SourceFileStructure, StatementStructures, StructureKind, Scope, CodeBlockWriter } from 'ts-morph';
import { L2ConstructProject } from './L2ConstructProject';
import { TSSourceCode } from './TSSourceCode';
export interface MetricData {
  dimensionsType?: string;
  namespace?: string;
  metricName?: string;
  statistic?: string;
  extends?: string;
}

export interface FixedCannedMetricsOptions {
  defaultDimensionsType: string;
}
export class FixedCannedMetrics extends TSSourceCode {
  public readonly project: L2ConstructProject;
  public readonly options: FixedCannedMetricsOptions;

  protected structure: SourceFileStructure;
  protected classStructure: ClassDeclarationStructure;

  public constructor(project: L2ConstructProject, options: FixedCannedMetricsOptions) {
    const metricsClassName = `${Case.pascal(project.shortName)}Metrics`;

    const structure: SourceFileStructure = {
      kind: StructureKind.SourceFile,
      statements: [
        {
          kind: StructureKind.ImportDeclaration,
          namedImports: [
            { name: metricsClassName, alias: 'CannedMetrics' },
          ],
          moduleSpecifier: `./${project.shortName}-canned-metrics.generated`,
        },
      ],
    };

    super(project, join(project.srcdir, `${project.shortName}-fixed-canned-metrics.ts`), structure);

    this.options = options;
    this.structure = structure;
    this.classStructure = {
      kind: StructureKind.Class,
      name: metricsClassName,
      isExported: true,
      leadingTrivia: `/**
  * This class is to consolidate all ${metricsClassName} in just one place.
  *
  * Current generated canned metrics don't match the proper metrics from the service. If it is fixed
  * at the source this class can be removed and just use the generated one directly.
  */\n`,
      methods: [],
    };
  }

  protected synthesizeContent(): string {
    (this.structure.statements as StatementStructures[])?.push(this.classStructure);
    this.file.set(this.structure);
    return super.synthesizeContent();
  }

  public addMetric(name: string, metric: MetricData) {
    const writer = new CodeBlockWriter({
      indentNumberOfSpaces: 2,
      useSingleQuote: true,
    });

    writer.write('return ').inlineBlock(() => {
      if (metric.extends) {
        writer.writeLine(`...CannedMetrics.${metric.extends}(dimensions),`);
      }
      if (metric.namespace || !metric.extends) {
        writer.writeLine(`namespace: '${metric.namespace ?? 'AWS/'+Case.pascal(this.project.shortName) }',`);
      }
      if (metric.metricName) {
        writer.writeLine(`metricName: '${metric.metricName}',`);
      }
      if (!metric.extends) {
        writer.writeLine('dimensionsMap: dimensions,');
      }
      if (metric.statistic) {
        writer.writeLine(`statistic: '${metric.statistic}',`);
      }
    }).write(';');

    (this.classStructure?.methods as MethodDeclarationStructure[])?.push({
      kind: StructureKind.Method,
      isStatic: true,
      scope: Scope.Public,
      name,
      parameters: [{
        name: 'dimensions',
        type: metric.dimensionsType ?? this.options.defaultDimensionsType,
      }],
      statements: writer.toString(),
    });

    return this;
  }
}