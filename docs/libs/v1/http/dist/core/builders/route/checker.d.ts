import { Floor } from '../../types';
import { RouteDefinition } from '../../route';
import { CheckerStepOtherwiseParams, CheckerStep } from '../../steps';
import { GetCheckerInput, Checker, GetCheckerResult, GetCheckerOptions } from '../../checker';
import { PredictedResponse } from '../../response';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs/lang/common";
import type * as DObject from "@duplojs/lang/object";
import type * as DArray from "@duplojs/lang/array";
declare module "./builder" {
    interface RouteBuilder<GenericDefinition extends RouteDefinition = RouteDefinition, GenericFloor extends Floor = {}> {
        check<GenericChecker extends Checker, GenericResultInformation extends DCommon.MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>, GenericInput extends GetCheckerInput<GenericChecker>, GenericResponse extends PredictedResponse, GenericIndex extends string = never, GenericOptions extends Exclude<GetCheckerOptions<GenericChecker>, undefined> = never, const GenericMetadata extends readonly Metadata[] = readonly []>(checker: GenericChecker, params: {
            input(floor: GenericFloor): GenericInput;
            readonly result: GenericResultInformation;
            readonly indexing?: GenericIndex;
            readonly options?: (GenericOptions | ((floor: GenericFloor) => GenericOptions));
            otherwise(params: CheckerStepOtherwiseParams<GenericFloor, Exclude<Awaited<GetCheckerResult<GenericChecker>>, {
                information: DArray.Unwrap<GenericResultInformation>;
            }>>): GenericResponse;
        }, ...metadata: GenericMetadata): RouteBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CheckerStep<{
                    readonly checker: GenericChecker;
                    readonly result: GenericResultInformation;
                    readonly indexing: DCommon.NeverCoalescing<GenericIndex, undefined>;
                    input(floor: GenericFloor): GenericInput;
                    readonly options: DCommon.IsNever<GenericOptions> extends true ? undefined : (input: GenericFloor) => GenericOptions;
                    otherwise(params: CheckerStepOtherwiseParams<GenericFloor, Exclude<Awaited<GetCheckerResult<GenericChecker>>, {
                        information: DArray.Unwrap<GenericResultInformation>;
                    }>>): GenericResponse;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DObject.Assign<GenericFloor, {
            [Prop in GenericIndex]: Extract<Awaited<GetCheckerResult<GenericChecker>>, {
                information: DArray.Unwrap<GenericResultInformation>;
            }>["value"];
        }>>;
    }
}
