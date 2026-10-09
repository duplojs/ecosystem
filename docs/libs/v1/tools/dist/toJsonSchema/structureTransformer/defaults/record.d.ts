import { JsonSchema } from '../../result';
export interface JsonSchemaRecord {
    type: "object";
    propertyNames: JsonSchema;
    additionalProperties: JsonSchema;
    required?: string[];
    minProperties?: number;
}
export declare const recordStructureTransformer: import('..').StructureTransformer;
