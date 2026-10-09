export declare function forwardAsserts<GenericInput extends unknown, GenericPredicate extends GenericInput>(predicate: (input: GenericInput) => input is GenericPredicate): (input: GenericInput) => GenericPredicate;
export declare function forwardAsserts<GenericInput extends unknown>(predicate: (input: GenericInput) => boolean): (input: GenericInput) => GenericInput;
export declare function forwardAsserts<GenericInput extends unknown, GenericPredicate extends GenericInput>(input: GenericInput, predicate: (input: GenericInput) => input is GenericPredicate): GenericPredicate;
export declare function forwardAsserts<GenericInput extends unknown>(input: GenericInput, predicate: (input: GenericInput) => boolean): GenericInput;
