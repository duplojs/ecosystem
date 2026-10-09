export interface Memoized<GenericValue extends unknown> {
    readonly value: GenericValue;
}
export declare function memo<GenericOutput extends unknown>(theFunction: () => GenericOutput): Memoized<GenericOutput>;
