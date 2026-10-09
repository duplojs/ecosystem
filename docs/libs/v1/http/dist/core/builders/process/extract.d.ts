import { Floor } from '../../types';
import { ExtractShape, ExtractStep } from '../../steps';
import { ClientErrorResponseCode, ResponseContract } from '../../response';
import { ProcessDefinition } from '../../process';
import { Metadata } from '../../metadata';
import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DObject from "@duplojs-v1/lang/object";
declare module "./builder" {
    interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> {
        extract<GenericShape extends ExtractShape, GenericResponseContract extends (ResponseContract.Contract<ClientErrorResponseCode, string, DDataStructure.Structure<undefined>> | undefined) = never, const GenericMetadata extends readonly Metadata[] = readonly []>(shape: GenericShape, responseContract?: GenericResponseContract, ...metadata: GenericMetadata): ProcessBuilder<DObject.Assign<GenericDefinition, {
            readonly steps: readonly [
                ...GenericDefinition["steps"],
                ExtractStep<{
                    readonly shape: GenericShape;
                    readonly responseContract: DCommon.NeverCoalescing<GenericResponseContract, undefined>;
                    readonly metadata: GenericMetadata;
                }>
            ];
        }>, DObject.Assign<GenericFloor, {
            [Prop in keyof GenericShape]: GenericShape[Prop] extends DDataStructure.Structure ? [Prop, DDataStructure.StructureValue<GenericShape[Prop]>] : GenericShape[Prop] extends infer InferredSubShape extends Record<string, DDataStructure.Structure> ? {
                [Prop in keyof InferredSubShape]: [Prop, DDataStructure.StructureValue<InferredSubShape[Prop]>];
            }[keyof InferredSubShape] : never;
        }[keyof GenericShape] extends infer InferredEntry extends DCommon.ObjectEntry ? DCommon.SimplifyTopLevel<{
            [Entry in InferredEntry as Entry[0]]: Entry[1];
        }> : never>>;
    }
}
