import { L2ConstructProject } from './projenrc/L2ConstructProject';
import * as meta from './projenrc/meta/';

const project = new L2ConstructProject({
  moduleName: 'aws-kinesis',
  devDeps: ['@swc/core'],
});

project.defaultTask?.reset('ts-node --swc --project tsconfig.dev.json .projenrc.ts');

project.synth();
project.addImplementation(new meta.StreamImplementation({
  defaults: {
  },
}));