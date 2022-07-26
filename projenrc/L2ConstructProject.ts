import * as cdk from 'aws-cdk-lib';
import { TextFile } from 'projen';
import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import { StructureKind } from 'ts-morph';
import { IImplementation } from './Implementation';
import { TSSourceCode } from './TSSourceCode';


export interface L2ConstructProjectOptions extends Omit<TypeScriptProjectOptions, 'name' | 'defaultReleaseBranch'> {
  moduleName: string;
  defaultReleaseBranch?: string;
}


export class L2ConstructProject extends TypeScriptProject {
  public constructor(options: L2ConstructProjectOptions) {
    super({
      name: '@aws-cdk/' + options.moduleName,
      defaultReleaseBranch: 'main',
      projenrcTs: true,
      ...options,
      devDeps: (options.devDeps ?? []).concat('aws-cdk-lib', 'constructs@^10', 'ts-morph'),
    });

    const cfnResources = Object.keys(cdk[options.moduleName.replace('-', '_') as keyof typeof cdk])
      .filter(resource => resource.startsWith('Cfn'));

    const exportFile = new TextFile(this, 'projenrc/meta/index.ts', {});

    for (const resource of cfnResources) {
      const className = `${resource.substring(3)}Implementation`;
      const optionsName = `${className}Options`;

      exportFile.addLine(`export * from './${className}';`);
      new TSSourceCode(this, `projenrc/meta/${className}.ts`, {
        kind: StructureKind.SourceFile,
        statements: [{
          kind: StructureKind.ImportDeclaration,
          namespaceImport: 'source',
          moduleSpecifier: `aws-cdk-lib/${options.moduleName}`,
        },
        {
          kind: StructureKind.ImportDeclaration,
          namedImports: [
            { name: 'BaseImplementation' },
            { name: 'BaseImplementationOptions' },
          ],
          moduleSpecifier: '../Implementation',
        },
        {
          kind: StructureKind.Interface,
          name: optionsName,
          extends: ['BaseImplementationOptions'],
          isExported: true,
          properties: [{
            name: 'defaults',
            type: '{[key in keyof source.CfnStreamProps]: any}',
          }],
        },
        {
          kind: StructureKind.Class,
          isAbstract: false,
          isExported: true,
          extends: 'BaseImplementation',
          name: className,
          ctors: [{
            kind: StructureKind.Constructor,
            parameters: [{
              name: 'options',
              type: optionsName,
            }],
            statements: 'super(options);',
          }],
          typeParameters: [],
          properties: [{
            name: 'resourceName',
            initializer: `'${resource}'`,
            type: 'string',
            isReadonly: true,
            isStatic: false,
          }],
          methods: [],
        }],
      });
    }
  }

  public addImplementation(implementation: IImplementation) {
    console.log(implementation.resourceName);
  }
}