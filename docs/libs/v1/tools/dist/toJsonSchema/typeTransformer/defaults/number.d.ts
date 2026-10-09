export interface JsonSchemaNumber {
    type: "number" | "integer";
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    allOf?: readonly Omit<JsonSchemaNumber, "type" | "allOf" | "anyOf">[];
    anyOf?: readonly Omit<JsonSchemaNumber, "type" | "allOf" | "anyOf">[];
}
export declare const numberTypeTransformer: import('..').TypeTransformer;
