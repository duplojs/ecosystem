import { JsonSchemaBigint } from './bigint';
export interface JsonSchemaBigintLiteral extends JsonSchemaBigint {
    const: bigint;
}
export declare const bigintLiteralTypeTransformer: import('..').TypeTransformer;
