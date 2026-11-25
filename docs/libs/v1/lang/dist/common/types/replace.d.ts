import { BaseConstraint, ConstraintSymbol, RemoveConstraint } from '../constraint';
import { IsEqual } from './isEqual';
import { ContainExtends } from './IsExtends';
import { NeverCoalescing } from './neverCoalescing';
import { UnionContain } from './unionContain';
import { DuploJSError } from '../error';
import { UnionToIntersection } from './unionToIntersection';
import type * as DKind from '../../kind';
import type * as DChrono from '../../chrono';
import type * as DObject from '../../object';
import type * as DModeling from '../../modeling';
type RemoveObjectConstraint<GenericObject extends object> = GenericObject extends BaseConstraint ? GenericObject extends infer InferredValue & Pick<GenericObject, ConstraintSymbol> ? RemoveConstraint<InferredValue> : never : GenericObject;
type FlagMetadata<GenericFlags extends Record<Capitalize<string>, unknown>> = UnionToIntersection<{
    [Prop in keyof GenericFlags]: Prop extends Capitalize<string> ? DModeling.Flag<Prop, GenericFlags[Prop]> : never;
}[keyof GenericFlags]>;
type ReplaceValue<GenericValue extends unknown, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal")> = GenericReplaceType extends unknown ? NeverCoalescing<GenericReplacer extends [unknown, unknown] ? (GenericReplaceType extends "extends" ? ContainExtends<GenericValue, GenericReplacer[0]> : IsEqual<GenericValue, GenericReplacer[0]>) extends true ? [GenericReplacer[1], true] : never : never, [
    GenericValue,
    false
]> : never;
type ReplaceProperties<GenericValue, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal")> = GenericValue extends unknown ? {
    readonly [Prop in keyof GenericValue]: ComputeReplace<GenericValue[Prop], GenericReplacer, GenericReplaceType>;
} : never;
type ReplaceObject<GenericObject extends object, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal"), GenericUnconstrainedValue = RemoveObjectConstraint<GenericObject>, GenericConstraint = (GenericObject extends (GenericUnconstrainedValue & (infer InferredConstraint extends BaseConstraint)) ? InferredConstraint : unknown), GenericMetadata = ((GenericObject extends DModeling.Entity<infer InferredName> ? DModeling.Entity<InferredName> : unknown) & (GenericObject extends DModeling.ObjectTag<infer InferredName> ? DModeling.ObjectTag<InferredName> : unknown) & (GenericObject extends DModeling.Flag ? FlagMetadata<DKind.GetValue<typeof DModeling.flagKind, GenericObject>> : unknown) & (GenericObject extends DModeling.Fact<infer InferredName, infer InferredPayload> ? DModeling.Fact<InferredName, InferredPayload> : unknown)), GenericClearValue = (GenericUnconstrainedValue extends GenericMetadata & infer InferredValue ? DKind.Remove<Extract<InferredValue, object>> : never)> = GenericClearValue extends unknown ? (GenericClearValue extends readonly unknown[] ? number extends GenericClearValue["length"] ? Exclude<keyof GenericClearValue, keyof unknown[]> extends never ? GenericClearValue extends readonly [...unknown[], unknown] ? ReplaceProperties<GenericClearValue, GenericReplacer, GenericReplaceType> : readonly ComputeReplace<GenericClearValue[number], GenericReplacer, GenericReplaceType>[] : ReplaceProperties<GenericClearValue, GenericReplacer, GenericReplaceType> : ReplaceProperties<GenericClearValue, GenericReplacer, GenericReplaceType> : ReplaceProperties<GenericClearValue, GenericReplacer, GenericReplaceType>) & GenericConstraint & GenericMetadata : never;
export interface ReplaceTraversalExclusions {
    theDate: DChrono.TheDate;
    theTime: DChrono.TheTime;
    error: DuploJSError;
}
type ComputeReplace<GenericValue extends unknown, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal")> = GenericValue extends unknown ? ReplaceValue<GenericValue, GenericReplacer, GenericReplaceType> extends infer InferredResult extends [unknown, boolean] ? InferredResult extends [infer InferredValue, false] ? InferredValue extends DObject.Values<ReplaceTraversalExclusions> ? InferredValue : InferredValue extends object ? HasObjectReplacement<InferredValue, GenericReplacer, GenericReplaceType> extends true ? ReplaceObject<InferredValue, GenericReplacer, GenericReplaceType> : InferredValue : InferredValue : InferredResult[0] : never : never;
type HasObjectReplacement<GenericObject extends object, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal"), GenericVisited extends readonly unknown[] = readonly [], GenericClearValue = DKind.Remove<Extract<RemoveObjectConstraint<GenericObject>, object>>> = UnionContain<GenericVisited[number], GenericObject> extends true ? false : GenericClearValue extends object ? HasReplacement<GenericClearValue extends readonly unknown[] ? GenericClearValue[number] : DObject.Values<GenericClearValue>, GenericReplacer, GenericReplaceType, readonly [...GenericVisited, GenericObject]> : false;
type HasReplacement<GenericValue extends unknown, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal"), GenericVisited extends readonly unknown[] = readonly []> = ContainExtends<GenericValue extends unknown ? ReplaceValue<GenericValue, GenericReplacer, GenericReplaceType> extends infer InferredResult extends [unknown, boolean] ? InferredResult extends [infer InferredValue, false] ? InferredValue extends DObject.Values<ReplaceTraversalExclusions> ? false : InferredValue extends object ? HasObjectReplacement<InferredValue, GenericReplacer, GenericReplaceType, GenericVisited> : false : true : never : never, true>;
export type Replace<GenericValue extends unknown, GenericReplacer extends [unknown, unknown], GenericReplaceType extends ("extends" | "equal")> = HasReplacement<GenericValue, GenericReplacer, GenericReplaceType> extends true ? ComputeReplace<GenericValue, GenericReplacer, GenericReplaceType> : GenericValue;
export {};
