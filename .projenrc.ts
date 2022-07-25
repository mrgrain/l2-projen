import { L2ConstructProject } from './projenrc/L2ConstructProject';
// import * as meta from './projenrc/meta/';

const project = new L2ConstructProject({
  moduleName: 'aws-kinesis',
});
project.synth();
// project.addImplementation(new meta.StreamImplementation());
// project.addImplementation(new meta.StreamConsumerImplementation());