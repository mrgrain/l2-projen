import { tmpdir } from 'os';
import { join } from 'path';
import { FileBase, Project } from 'projen';
import { SourceFileStructure, Project as TSProject, SourceFile, IndentationText, QuoteKind } from 'ts-morph';

export class TSSourceCode extends FileBase {

  public readonly filePath: string;
  protected ts: TSProject;
  protected file: SourceFile;

  public constructor(project: Project, filePath: string, structure: SourceFileStructure) {
    super(project, filePath);
    this.ts = new TSProject({
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
        quoteKind: QuoteKind.Single,
      },
    });

    this.filePath = filePath;
    this.file = this.ts.createSourceFile(join(tmpdir(), filePath));
    this.file.set(structure);
  }

  protected synthesizeContent(): string {
    return this.file.getFullText();
  }
}