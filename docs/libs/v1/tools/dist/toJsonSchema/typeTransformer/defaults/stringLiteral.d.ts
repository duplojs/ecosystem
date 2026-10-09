import { JsonSchemaString } from './string';
export interface JsonSchemaStringLiteral extends JsonSchemaString {
    const: string;
}
export declare const stringLiteralTypeTransformer: import('..').TypeTransformer;
