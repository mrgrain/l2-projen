import * as cdk from 'aws-cdk-lib';
import { TextFile } from 'projen';
import { TypeScriptProject, TypeScriptProjectOptions } from 'projen/lib/typescript';
import { StructureKind } from 'ts-morph';
import { IImplementation } from './Implementation';
import { L2Gen } from './L2Gen';
import { TSSourceCode } from './TSSourceCode';


export interface L2ConstructProjectOptions extends Omit<TypeScriptProjectOptions, 'name' | 'defaultReleaseBranch'> {
  moduleName: string;
  scope: string;
  defaultReleaseBranch?: string;
}


export class L2ConstructProject extends TypeScriptProject {
  public constructor(options: L2ConstructProjectOptions) {
    super({
      name: '@aws-cdk/' + options.moduleName,
      defaultReleaseBranch: 'main',
      projenrcTs: true,
      ...options,
      devDeps: (options.devDeps ?? []).concat(
        'aws-cdk-lib',
        'constructs@^10',
        'ts-morph',
        '@aws-cdk/cfn2ts@link:~/.config/yarn/link/@aws-cdk/cfn2ts',
        '@aws-cdk/cfnspec@link:~/.config/yarn/link/@aws-cdk/cfnspec',
      ),
    });

    const { l1Generated, l2Generated, cannedMetricsGenerated } = new L2Gen(this, {
      moduleName: options.moduleName,
      scope: options.scope,
      outdir: 'module',
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
            name: 'props',
            type: `{[key in keyof source.${resource}Props]: any}`,
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