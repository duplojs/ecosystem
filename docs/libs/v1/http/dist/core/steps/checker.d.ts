import { StepKind } from './kind';
import { CheckerFunctionOutput, Checker } from '../checker';
import { Floor } from '../types';
import { Metadata } from '../metadata';
import { PredictedResponse } from '../response';
import { ResponseHelper } from '../response/helpers';
import * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
export interface CheckerStepOtherwiseParams<GenericFloor extends Floor = Floor, GenericResult extends CheckerFunctionOutput = CheckerFunctionOutput> {
    response: ResponseHelper.Methods400;
    floor: GenericFloor;
    result: GenericResult;
}
export interface CheckerStepDefinition {
    readonly checker: Checker;
    readonly result: string | readonly string[];
    readonly indexing?: string;
    input(input: Floor): unknown;
    options?(input: Floor): Record<string, unknown>;
    otherwise(params: CheckerStepOtherwiseParams): PredictedResponse;
    readonly metadata: readonly Metadata[];
}
export declare const checkerStepKind: DKind.Handler<DKind.Definition<"@DuplojsHttpCore/checker-step", unknown>>;
export interface CheckerStep<GenericDefinition extends CheckerStepDefinition = CheckerStepDefinition> extends DCommon.Forward<DKind.Kind<typeof checkerStepKind> & StepKind> {
    readonly definition: GenericDefinition;
}
export declare function createCheckerStep<GenericDefinition extends CheckerStepDefinition>(definition: GenericDefinition): CheckerStep<GenericDefinition>;
