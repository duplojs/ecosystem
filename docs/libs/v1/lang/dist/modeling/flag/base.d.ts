import { EntityStructure, Entity } from '../entity';
import type * as DKind from '../../kind';
import type * as DDataStructure from '../../dataStructure';
export declare const flagKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/flag", Record<string, unknown>>>;
export interface Flag<GenericName extends Capitalize<string> = Capitalize<string>, GenericPayload extends unknown = unknown> extends DKind.Kind<typeof flagKind, Record<GenericName, GenericPayload>> {
}
export type GetFlagName<GenericFlag extends Flag> = GenericFlag extends Flag<infer InferredName extends Capitalize<string>> ? InferredName : never;
export type GetFlagPayload<GenericFlag extends Flag> = GenericFlag extends Flag<any, infer InferredPayload> ? InferredPayload : never;
declare const flagHandlerKind: DKind.Handler<DKind.Definition<"@DuplojsLangModeling/flag-handler", unknown>>;
export interface FlagHandler<GenericName extends Capitalize<string> = Capitalize<string>, GenericEntity extends Entity = Entity, GenericPayload extends unknown = unknown> extends DKind.Kind<typeof flagHandlerKind> {
    readonly name: GenericName;
    append<GenericInputEntity extends GenericEntity, const GenericInputPayload extends GenericPayload>(value: GenericInputPayload): (entity: GenericInputEntity) => (GenericInputEntity & Flag<GenericName, GenericInputPayload>);
    append<GenericInputEntity extends GenericEntity, const GenericInputPayload extends GenericPayload>(entity: GenericInputEntity, value: GenericInputPayload): (GenericInputEntity & Flag<GenericName, GenericInputPayload>);
    getPayload<GenericInputEntity extends GenericEntity & Flag<GenericName, GenericPayload>>(entity: GenericInputEntity): DKind.GetValue<typeof flagKind, GenericInputEntity>[GenericName];
    has<GenericInputEntity extends GenericEntity>(entity: GenericInputEntity): entity is Extract<GenericInputEntity, Flag<GenericName, any>>;
}
export declare function createFlag<GenericFLag extends Flag, GenericEntityStructure extends EntityStructure>(name: GetFlagName<GenericFLag>): FlagHandler<GetFlagName<GenericFLag>, DDataStructure.StructureValue<GenericEntityStructure>, GetFlagPayload<GenericFLag>>;
export {};
