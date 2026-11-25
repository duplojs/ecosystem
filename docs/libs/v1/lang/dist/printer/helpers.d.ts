import { Indent } from './indent';
import { RenderInput } from './types';
export interface IndentParams {
    indent?: Indent;
    indentLevel?: number;
}
export declare function resolveIndent(params: IndentParams): string;
export declare function collectPrintableValues(values: readonly RenderInput[]): readonly string[];
