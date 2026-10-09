import { RenderInput } from './types';
export declare function render<GenericValues extends readonly RenderInput[]>(joinCharacter: string): (values: GenericValues) => string;
export declare function render<GenericValues extends readonly RenderInput[]>(values: GenericValues, joinCharacter: string): string;
