import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericEntity extends DModeling.Entity> = {
    [Entity in GenericEntity as DModeling.GetEntityName<Entity>]?: (value: Entity) => unknown;
};
type ForbiddenMoreKey<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetEntityName<GenericEntity>>, string>>;
type HandledKeys<GenericMatcher extends object> = Extract<DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>, string>;
type UnhandledEntity<GenericEntity extends DModeling.Entity, GenericMatcher extends object> = Exclude<GenericEntity, DModeling.ExtractByEntityName<GenericEntity, HandledKeys<GenericMatcher>>>;
type RequireSimpleName<GenericEntity extends DModeling.Entity> = DString.RequireSimpleLiteral<DModeling.GetEntityName<GenericEntity>>;
export declare function matchWithEntityOtherwise<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>, GenericOutput>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericEntity>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericEntity>, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledEntity<GenericEntity, GenericMatcher>>) => GenericOutput): (input: GenericEntity & RequireSimpleName<GenericEntity>) => (ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export declare function matchWithEntityOtherwise<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>, GenericOutput>(input: GenericEntity & RequireSimpleName<GenericEntity>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericEntity>, GenericMatcher> & ForbiddenMoreKey<GenericEntity, GenericMatcher>), otherwise: (value: DCommon.BreakGenericLink<UnhandledEntity<GenericEntity, GenericMatcher>>) => GenericOutput): (ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>> | GenericOutput);
export {};
