export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput, GenericPredicatedValue extends GenericInput[GenericKey]>(key: GenericKey, predicate: (value: GenericInput[GenericKey]) => value is GenericPredicatedValue): (input: GenericInput) => input is GenericInput & {
    [Prop in GenericKey]: GenericPredicatedValue;
};
export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput>(key: GenericKey, predicate: (value: GenericInput[GenericKey]) => boolean): (input: GenericInput) => boolean;
export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput, GenericPredicatedValue extends GenericInput[GenericKey]>(input: GenericInput, key: GenericKey, predicate: (value: GenericInput[GenericKey]) => value is GenericPredicatedValue): input is GenericInput & {
    [Prop in GenericKey]: GenericPredicatedValue;
};
export declare function discriminate<GenericInput extends object, GenericKey extends keyof GenericInput>(input: GenericInput, key: GenericKey, predicate: (value: GenericInput[GenericKey]) => boolean): boolean;
