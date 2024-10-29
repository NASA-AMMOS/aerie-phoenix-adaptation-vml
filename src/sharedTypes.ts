/**
 * These are copy-pasted from aerie-ui, they will need manual update until we publish those types.
 */

import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { IndentContext } from '@codemirror/language';
import type { Diagnostic } from '@codemirror/lint';
import type { SyntaxNode } from '@lezer/common';
import type { EditorView } from 'codemirror';
import { ChannelDictionary, CommandDictionary, FswCommandArgument, ParameterDictionary } from '@nasa-jpl/aerie-ampcs';

export enum GlobalTypes {
  int = 'int',
  flt = 'flt',
  str = 'str',
  uint = 'uint',
}

export type GlobalType = {
  name: string;
  type: GlobalTypes;
};

export type ArgDelegator = {
  [stem: string]: {
    [arg: string]:
      | undefined
      | ((
          argDef: FswCommandArgument,
          paramDictionaries: ParameterDictionary[],
          channelDictionary: ChannelDictionary | null,
          precedingArgValues: string[],
        ) => FswCommandArgument | undefined);
  };
};

export interface ISequenceAdaptation {
  argDelegator?: ArgDelegator;
  autoComplete: (
    channelDictionary: ChannelDictionary | null,
    commandDictionary: CommandDictionary | null,
    parameterDictionaries: ParameterDictionary[],
  ) => (context: CompletionContext) => CompletionResult | null;
  autoIndent?: () => (context: IndentContext, pos: number) => number | null | undefined;
  globals?: GlobalType[];
  inputFormat: {
    linter?: (
      diagnostics: Diagnostic[],
      commandDictionary: CommandDictionary,
      view: EditorView,
      node: SyntaxNode,
    ) => Diagnostic[];
    name: string;
    toInputFormat?(input: string): Promise<string>;
  };
  modifyOutput?: (
    output: string,
    parameterDictionaries: ParameterDictionary[],
    channelDictionary: ChannelDictionary | null,
  ) => any;
  modifyOutputParse?: (
    output: string,
    parameterDictionaries: ParameterDictionary[],
    channelDictionary: ChannelDictionary | null,
  ) => any;
  outputFormat: IOutputFormat[];
}

export interface IOutputFormat {
  compile?: (output: string) => Promise<void>;
  fileExtension: string;
  linter?: (
    diagnostics: Diagnostic[],
    commandDictionary: CommandDictionary,
    view: EditorView,
    node: SyntaxNode,
  ) => Diagnostic[];
  name: string;
  toOutputFormat?(
    tree: any,
    sequence: string,
    commandDictionary: CommandDictionary | null,
    sequenceName: string,
  ): Promise<string>;
}
