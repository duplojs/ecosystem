export type PrintParams = ("info" | "warn" | "error" | {
    columns: string[];
    depth?: never;
} | {
    depth: number | null;
    columns?: never;
});
export declare function print<const GenericInput>(input: GenericInput, params?: PrintParams): GenericInput;
