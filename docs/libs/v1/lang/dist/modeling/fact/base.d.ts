import { EntityStructure, Entity } from '../entity';
import type * as DCommon from '../../common';
import type * as DKind from '../../kind';
import type * as DDataStructure from '../../dataStructure';
import * as DEither from '../../either';
export interface FactValue<GenericName extends string = string, GenericPayload extends unknown = unknown> {
    name: GenericName;
    payload: GenericPayload;
}
export declare const factKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/fact", FactValue<string, unknown>>>;
export interface Fact<GenericName extends Capitalize<string> = Capitalize<string>, GenericValue extends unknown = unknown> extends DKind.Kind<typeof factKind, FactValue<GenericName, GenericValue>> {
}
export type GetFactName<GenericHandler extends Fact> = GenericHandler extends Fact<infer InferredName extends Capitalize<string>> ? InferredName : never;
export type GetFactPayload<GenericHandler extends Fact> = GenericHandler extends Fact<any, infer InferredPayload extends object> ? InferredPayload : never;
export type FactRun<GenericName extends string = string> = DCommon.AnyFunction<any[], DEither.Left | DEither.Right<`fact-result-${GenericName}`, unknown>>;
declare const factHandlerKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/fact-handler", unknown>>;
export interface FactHandler<GenericName extends Capitalize<string> = Capitalize<string>, GenericEntity extends Entity = Entity, GenericPayload extends object = object, GenericRun extends FactRun<GenericName> = FactRun<GenericName>> extends DKind.Kind<typeof factHandlerKind> {
    readonly name: GenericName;
    run: GenericRun;
    getPayload<GenericInputEntity extends Fact<GenericName, GenericPayload>>(entity: GenericInputEntity): DKind.GetValue<typeof factKind, GenericInputEntity>["payload"];
    has<GenericInputEntity extends GenericEntity>(entity: GenericInputEntity): entity is Extract<GenericInputEntity, Fact<GenericName>>;
}
type RemoveFact<GenericEntity extends Entity> = GenericEntity extends Fact<infer InferredName, infer InferredValue> ? GenericEntity extends (infer InferredEntity & Fact<InferredName, InferredValue>) ? InferredEntity : GenericEntity : GenericEntity;
export interface CreateFactConstructorParams<GenericName extends Capitalize<string> = Capitalize<string>, GenericEntity extends Entity = Entity, GenericPayload extends object = object> {
    applyFact<GenericInputEntity extends GenericEntity, GenericInputPayload extends GenericPayload>(payload: GenericInputPayload): (entity: GenericInputEntity) => DEither.Right<`fact-result-${GenericName}`, RemoveFact<GenericInputEntity> & Fact<GenericName, GenericInputPayload>>;
    applyFact<GenericInputEntity extends GenericEntity, GenericInputPayload extends GenericPayload>(entity: GenericInputEntity, payload: GenericInputPayload): DEither.Right<`fact-result-${GenericName}`, RemoveFact<GenericInputEntity> & Fact<GenericName, GenericInputPayload>>;
}
export declare function createFact<GenericFact extends Fact, GenericEntityStructure extends EntityStructure>(name: GetFactName<GenericFact>): <GenericRun extends FactRun<GetFactName<GenericFact>>>(createRun: (params: CreateFactConstructorParams<GetFactName<GenericFact>, DDataStructure.StructureValue<GenericEntityStructure>, GetFactPayload<GenericFact>>) => GenericRun) => FactHandler<GetFactName<GenericFact>, DDataStructure.StructureValue<GenericEntityStructure>, GetFactPayload<GenericFact>, GenericRun>;
export {};
