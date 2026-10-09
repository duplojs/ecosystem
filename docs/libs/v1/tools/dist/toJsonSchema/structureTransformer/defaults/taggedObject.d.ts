import { JsonSchemaObject } from './object';
export interface JsonSchemaTaggedObject extends JsonSchemaObject {
    title: string;
}
export declare const taggedObjectStructureTransformer: import('..').StructureTransformer;
