import { JsonSchemaNumber } from './number';
export interface JsonSchemaNumberLiteral extends JsonSchemaNumber {
    const: number;
}
export declare const numberLiteralTypeTransformer: import('..').TypeTransformer;
