import type * as DCommon from '../common';
export declare function discriminateEntryValue<GenericEntry extends readonly [string, unknown], GenericPredicateEntryValue extends GenericEntry[1]>(predicate: (value: GenericEntry[1]) => value is GenericPredicateEntryValue): (entry: GenericEntry) => entry is Extract<DCommon.CleanObjectEntry<GenericEntry>, [
    string,
    GenericPredicateEntryValue
]>;
export declare function discriminateEntryValue<GenericEntry extends readonly [string, unknown]>(predicate: (value: GenericEntry[1]) => boolean): (entry: GenericEntry) => boolean;
export declare function discriminateEntryValue<GenericEntry extends readonly [string, unknown], GenericPredicateEntryValue extends GenericEntry[1]>(entry: GenericEntry, predicate: (value: GenericEntry[1]) => value is GenericPredicateEntryValue): entry is Extract<DCommon.CleanObjectEntry<GenericEntry>, [
    string,
    GenericPredicateEntryValue
]>;
export declare function discriminateEntryValue<GenericEntry extends readonly [string, unknown]>(entry: GenericEntry, predicate: (value: GenericEntry[1]) => boolean): boolean;
