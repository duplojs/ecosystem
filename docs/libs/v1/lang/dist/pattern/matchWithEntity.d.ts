import type * as DCommon from '../common';
import * as DModeling from '../modeling';
import type * as DObject from '../object';
import type * as DString from '../string';
type ComputeMatcher<GenericEntity extends DModeling.Entity> = {
    [Entity in GenericEntity as DModeling.GetEntityName<Entity>]: (value: Entity) => unknown;
};
type ForbiddenMoreKey<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, DModeling.GetEntityName<GenericEntity>>, string>>;
type RequireSimpleName<GenericEntity extends DModeling.Entity> = DString.RequireSimpleLiteral<DModeling.GetEntityName<GenericEntity>>;
export declare function matchWithEntity<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>>(matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericEntity>, GenericMatcher> & ForbiddenMoreKey<NoInfer<GenericEntity>, GenericMatcher>)): (input: GenericEntity & RequireSimpleName<GenericEntity>) => ReturnType<Extract<NoInfer<GenericMatcher>[keyof GenericMatcher], DCommon.AnyFunction>>;
export declare function matchWithEntity<GenericEntity extends DModeling.Entity, GenericMatcher extends ComputeMatcher<GenericEntity>>(input: GenericEntity & RequireSimpleName<GenericEntity>, matcher: (DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericEntity>, GenericMatcher> & ForbiddenMoreKey<GenericEntity, GenericMatcher>)): ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>;
export {};
