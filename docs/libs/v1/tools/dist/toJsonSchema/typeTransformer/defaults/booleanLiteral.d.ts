import { JsonSchemaBoolean } from './boolean';
export interface JsonSchemaBooleanLiteral extends JsonSchemaBoolean {
    const: boolean;
}
export declare const booleanLiteralTypeTransformer: import('..').TypeTransformer;
