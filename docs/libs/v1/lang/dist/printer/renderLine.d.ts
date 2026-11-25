import { IndentParams } from './helpers';
import { RenderInput } from './types';
export interface RenderLineParams extends IndentParams {
    joinCharacter?: string;
}
export declare function renderLine(values: readonly RenderInput[], params?: RenderLineParams): string;
