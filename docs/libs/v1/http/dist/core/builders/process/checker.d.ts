import { Floor } from '../../types';
import { CheckerStep } from '../../steps';
import { GetCheckerResult, Checker, GetCheckerInput, GetCheckerOptions } from '../../checker';
import { ClientErrorResponseCode, ResponseContract } from '../../response';
import { ProcessDefinition } from '../../process';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DObject from "@duplojs-v1/lang/object";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DArray from "@duplojs-v1/lang/array";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        check<GenericChecker extends Checker, GenericResultInformation extends DCommon.MaybeArray<Awaited<GetCheckerResult<GenericChecker>>["information"]>, GenericInput extends GetCheckerInput<GenericChecker>, GenericResponseContract extends ResponseContract.Contract<ClientErrorResponseCode, string, DDataStructure.Structure<undefined>>, GenericIndex extends string = never, GenericOptions extends (GetCheckerOptions<GenericChecker> | ((floor: GenericFloor) => Exclude<GetCheckerOptions<GenericChecker>, undefined>)) = never, const GenericMetadata extends readonly Metadata[] = readonly []>(checker: GenericChecker, params: {
            input(floor: GenericFloor): GenericInput;
            readonly result: GenericResultInformation;
            readonly indexing?: GenericIndex;
            readonly options?: DCommon.FixDeepFunctionInfer<GenericChecker["definition"]["options"] | ((floor: GenericFloor) => GenericChecker["definition"]["options"]), GenericOptions>;
            readonly otherwise: GenericResponseContract;
        }, ...metadata: GenericMetadata): ProcessBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                CheckerStep<{
                    readonly checker: GenericChecker;
                    readonly result: GenericResultInformation;
                    readonly indexing: DCommon.NeverCoalescing<GenericIndex, undefined>;
                    input(floor: GenericFloor): GenericInput;
                    readonly options: DCommon.NeverCoalescing<Extract<GenericOptions, DCommon.AnyFunction | GenericChecker["definition"]["options"]>, undefined>;
                    readonly responseContract: GenericResponseContract;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DObject.Assign<GenericFloor, {
            [Prop in GenericIndex]: Extract<Awaited<GetCheckerResult<GenericChecker>>, {
                information: DArray.Coalescing<GenericResultInformation>[number];
            }>["value"];
        }>>;
    }
}
