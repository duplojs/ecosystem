import { JsonSchemaObject } from './object';
export interface JsonSchemaEntity extends JsonSchemaObject {
    title: string;
}
export declare const entityStructureTransformer: import('..').StructureTransformer;
