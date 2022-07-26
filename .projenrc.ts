import { L2ConstructProject } from './projenrc/L2ConstructProject';


const project = new L2ConstructProject({
  moduleName: 'aws-kinesis',
  scope: 'AWS::Kinesis',
  devDeps: [
    '@swc/core',
    '@aws-cdk/cfn2ts@link:~/.config/yarn/link/@aws-cdk/cfn2ts',
    '@aws-cdk/cfnspec@link:~/.config/yarn/link/@aws-cdk/cfnspec',
  ],
});

project.defaultTask?.reset('ts-node --swc --project tsconfig.dev.json .projenrc.ts');

project.synth();