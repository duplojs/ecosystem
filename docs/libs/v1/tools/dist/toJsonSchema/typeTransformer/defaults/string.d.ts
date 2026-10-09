export interface JsonSchemaString {
    type: "string" | ("string" | "number" | "boolean" | "null")[];
    pattern?: string;
    format?: "uri" | "email" | "uuid" | "path" | "absolute-path" | "segment-path" | "date-time" | "time";
    minLength?: number;
    maxLength?: number;
    allOf?: readonly Omit<JsonSchemaString, "type" | "allOf" | "anyOf">[];
    anyOf?: readonly Omit<JsonSchemaString, "type" | "allOf" | "anyOf">[];
}
export declare const stringTypeTransformer: import('..').TypeTransformer;
