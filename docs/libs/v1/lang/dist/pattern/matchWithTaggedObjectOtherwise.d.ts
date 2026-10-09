import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericTaggedObject extends DModeling.ObjectTag> = {
    [TaggedObject in GenericTaggedObject as DModeling.GetTagValue<TaggedObject>]?: (value: TaggedObject) => unknown;
};
type ForbiddenMoreKey<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetTagValue<GenericTaggedObject>>, string>>;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>;
type UnhandledTaggedObject<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends object> = Exclude<GenericTaggedObject, DModeling.ObjectTag<HandledKeys<GenericMatcher>>>;
type RequireLiteralTag<GenericTaggedObject extends DModeling.ObjectTag> = DString.RequireSimpleLiteral<DModeling.GetTagValue<GenericTaggedObject>>;
export declare function matchWithTaggedObjectOtherwise<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>, GenericOutput>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericTaggedObject>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericTaggedObject>, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledTaggedObject<GenericTaggedObject, GenericMatcher>>) => GenericOutput): (input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>) => (ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithTaggedObjectOtherwise<GenericTaggedObject extends DModeling.ObjectTag, GenericMatcher extends ComputeMatcher<GenericTaggedObject>, GenericOutput>(input: GenericTaggedObject & RequireLiteralTag<GenericTaggedObject>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericTaggedObject>, GenericMatcher> & ForbiddenMoreKey<GenericTaggedObject, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledTaggedObject<GenericTaggedObject, GenericMatcher>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
