import { SuccessSymbol, ErrorSymbol } from '../common';
import type * as DKind from '../../kind';
import * as DCommon from '../../common';
export declare const constraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/constraint", unknown>>;
export interface ConstraintDefinition {
    readonly message?: string;
}
declare const BivariousSymbol: unique symbol;
export interface Constraint<GenericInput extends unknown = unknown, GenericChecked extends GenericInput = GenericInput, GenericDefinition extends ConstraintDefinition = ConstraintDefinition> extends DKind.Kind<typeof constraintKind, DCommon.IsEqual<GenericInput, GenericChecked> extends true ? any : GenericChecked> {
    readonly definition: GenericDefinition;
    readonly [BivariousSymbol]?: DCommon.IsUnion<GenericInput> extends true ? (input: GenericInput) => void : unknown;
    executeCheck(data: GenericInput): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    isAsynchronous(): boolean;
    clone(): this;
    setMessage(massage: string): this;
    addMessage(massage: string): this;
}
export interface CreateConstraintInitParams<GenericConstraint extends Constraint = Constraint> {
    executeCheck(self: GenericConstraint, data: Parameters<GenericConstraint["executeCheck"]>[0]): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    isAsynchronous(self: GenericConstraint): boolean;
}
export declare class ConstraintBase {
    private constructor();
    static init(params: DKind.Remove<Constraint>): Constraint;
    static addToPrototype<GenericProp extends keyof Constraint>(prop: GenericProp, value: Constraint[GenericProp] extends infer InferredValue ? InferredValue extends DCommon.AnyFunction ? (self: Constraint, ...rest: Parameters<InferredValue>) => ReturnType<InferredValue> : Constraint[GenericProp] : never): void;
}
export interface CreateConstraintConstructorParams<GenericKindHandler extends DKind.Handler = DKind.Handler> {
    init<GenericConstraint extends (Constraint & DKind.Kind<GenericKindHandler>)>(definition: GenericConstraint["definition"], params: CreateConstraintInitParams<GenericConstraint>): GenericConstraint;
}
export declare function createConstraint<GenericKindHandler extends DKind.Handler, GenericConstructor extends ((...args: any[]) => (Constraint & DKind.Kind<GenericKindHandler>))>(kindHandler: GenericKindHandler, createConstructor: (params: CreateConstraintConstructorParams<GenericKindHandler>) => GenericConstructor): GenericConstructor;
export {};
