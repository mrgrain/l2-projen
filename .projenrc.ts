import { L2ConstructProject } from './projenrc/L2ConstructProject';


const project = new L2ConstructProject({
  moduleName: 'aws-kinesis',
  scope: 'AWS::Kinesis',
  devDeps: ['@swc/core'],
});

project.defaultTask?.reset('ts-node --swc --project tsconfig.dev.json .projenrc.ts');


project.addMetric({
  name: 'getRecordsBytesAverage',
  namespace: 'AWS/Kinesis',
  metricName: 'GetRecords.Bytes',
  statistic: 'Average',
  dimensionsType: '{ StreamName: string }',
});

project.synth();