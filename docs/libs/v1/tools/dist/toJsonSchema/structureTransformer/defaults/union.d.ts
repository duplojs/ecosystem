import { JsonSchema } from '../../result';
export interface JsonSchemaUnion {
    anyOf: JsonSchema[];
}
export declare const unionStructureTransformer: import('..').StructureTransformer;
