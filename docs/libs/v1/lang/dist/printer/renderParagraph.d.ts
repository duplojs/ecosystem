import { Back } from './back';
import { IndentParams } from './helpers';
import { RenderInput } from './types';
export interface RenderParagraphParams extends IndentParams {
    back?: Back;
}
export declare function renderParagraph(params: RenderParagraphParams): (values: readonly RenderInput[]) => string;
export declare function renderParagraph(values: readonly RenderInput[], params?: RenderParagraphParams): string;
