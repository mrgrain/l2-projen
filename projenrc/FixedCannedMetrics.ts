import { join } from 'path';
import * as Case from 'case';
import { ClassDeclarationStructure, MethodDeclarationStructure, SourceFileStructure, StatementStructures, StructureKind, Scope } from 'ts-morph';
import { L2ConstructProject } from './L2ConstructProject';
import { TSSourceCode } from './TSSourceCode';

export interface MetricData {
  name: string;
  dimensionsType: string;
  namespace?: string;
  metricName?: string;
  statistic?: string;
  extends?: string;
}

export class FixedCannedMetrics extends TSSourceCode {
  protected structure: SourceFileStructure;
  protected classStructure: ClassDeclarationStructure;

  public constructor(project: L2ConstructProject) {
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

  public addMetric(metric: MetricData) {
    (this.classStructure?.methods as MethodDeclarationStructure[])?.push({
      kind: StructureKind.Method,
      isStatic: true,
      scope: Scope.Public,
      name: metric.name,
      parameters: [{
        name: 'dimensions',
        type: metric.dimensionsType,
      }],
      statements: `return {
  namespace: '${metric.namespace}',
  metricName: '${metric.metricName}',
  dimensionsMap: dimensions,
  statistic: '${metric.statistic}',
};`,

    });
  }
}

// public static getRecordsBytesAverage(dimensions: { StreamName: string }) {
//     return {
//       namespace: 'AWS/Kinesis',
//       metricName: 'GetRecords.Bytes',
//       dimensionsMap: dimensions,
//       statistic: 'Average',
//     };
//   }