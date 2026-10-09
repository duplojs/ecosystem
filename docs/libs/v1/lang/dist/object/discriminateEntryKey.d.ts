import type * as DCommon from '../common';
export declare function discriminateEntryKey<GenericEntry extends readonly [string, unknown], GenericPredicateEntryKey extends GenericEntry[0]>(predicate: (key: GenericEntry[0]) => key is GenericPredicateEntryKey): (entry: GenericEntry) => entry is Extract<DCommon.CleanObjectEntry<GenericEntry>, [
    GenericPredicateEntryKey,
    unknown
]>;
export declare function discriminateEntryKey<GenericEntry extends readonly [string, unknown]>(predicate: (key: GenericEntry[0]) => boolean): (entry: GenericEntry) => boolean;
export declare function discriminateEntryKey<GenericEntry extends readonly [string, unknown], GenericPredicateEntryKey extends GenericEntry[0]>(entry: GenericEntry, predicate: (key: GenericEntry[0]) => key is GenericPredicateEntryKey): entry is Extract<DCommon.CleanObjectEntry<GenericEntry>, [
    GenericPredicateEntryKey,
    unknown
]>;
export declare function discriminateEntryKey<GenericEntry extends readonly [string, unknown]>(entry: GenericEntry, predicate: (key: GenericEntry[0]) => boolean): boolean;
