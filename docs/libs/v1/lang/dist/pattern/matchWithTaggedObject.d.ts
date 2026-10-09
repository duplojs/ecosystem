import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericTaggedObject extends DModeling.ObjectTag> = {
    [TaggedObject in GenericTaggedObject as DModeling.GetTagValue<TaggedObject>]: (value: TaggedObject) => unknown;
};
type ForbiddenMoreKey<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetTagValue<GenericTaggedObject>>, string>>;
type RequireSimpleTag<GenericTaggedObject extends DModeling.ObjectTag> = DString.RequireSimpleLiteral<DModeling.GetTagValue<GenericTaggedObject>>;
export declare function matchWithTaggedObject<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericTaggedObject>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericTaggedObject>, GenericMatcher>)): (input: GenericTaggedObject & RequireSimpleTag<GenericTaggedObject>) => ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>;
export declare function matchWithTaggedObject<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>>(input: GenericTaggedObject & RequireSimpleTag<GenericTaggedObject>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericTaggedObject>, GenericMatcher> & ForbiddenMoreKey<GenericTaggedObject, GenericMatcher>)): ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>;
export {};
