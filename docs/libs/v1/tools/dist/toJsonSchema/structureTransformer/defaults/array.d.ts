import { JsonSchema } from '../../result';
export interface JsonSchemaArray {
    type: "array";
    items: JsonSchema;
    minItems?: number;
    maxItems?: number;
    allOf?: readonly Omit<JsonSchemaArray, "type" | "items" | "allOf">[];
}
export declare const arrayStructureTransformer: import('..').StructureTransformer;
