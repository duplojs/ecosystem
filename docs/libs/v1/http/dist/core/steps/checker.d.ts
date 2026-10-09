import { StepKind } from './kind';
import { Checker } from '../checker';
import { Floor } from '../types';
import { ClientErrorResponseCode, ResponseContract } from '../response';
import { Metadata } from '../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface CheckerStepDefinition {
    readonly checker: Checker;
    readonly result: string | readonly string[];
    readonly indexing?: string;
    input(input: Floor): unknown;
    readonly options?: Record<string, unknown> | ((input: any) => Record<string, unknown>);
    readonly responseContract: ResponseContract.Contract<ClientErrorResponseCode, string, DDataStructure.Structure<undefined>>;
    readonly metadata: readonly Metadata[];
}
export declare const checkerStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/checker-step", unknown>>;
export interface CheckerStep<GenericDefinition extends CheckerStepDefinition = CheckerStepDefinition> extends DCommon.Forward<DKind.Kind<typeof checkerStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createCheckerStep<GenericDefinition extends CheckerStepDefinition>(definition: GenericDefinition): CheckerStep<GenericDefinition>;
