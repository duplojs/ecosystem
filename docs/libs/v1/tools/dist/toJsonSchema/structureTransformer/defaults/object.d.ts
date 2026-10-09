import { JsonSchema } from '../../result';
export interface JsonSchemaObject {
    type: "object";
    properties: Record<string, JsonSchema>;
    required: string[];
    additionalProperties: false;
}
export declare const objectStructureTransformer: import('..').StructureTransformer;
