import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { type Codecs, type EncodedValue, ErrorSymbol, SuccessSymbol } from "../../common";
import { type StructureValue } from "../types";

declare module "../../common" {
	interface EncodeStructure<
		GenericValue extends unknown,
		GenericCodecs extends Codecs,
	> {
		array: GenericValue extends readonly (infer InferredElement)[]
			? GenericValue extends DCommon.AnyTuple
				? never
				: readonly EncodedValue<
					InferredElement,
					GenericCodecs
				>[]
			: never;
	}
}

export const arrayStructureKind = createKind("array-structure");

export interface ArrayStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly element: Structure;
}

export interface ArrayStructure<
	out GenericValue extends readonly unknown[] = readonly unknown[],
	out GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.Forward<
		& Structure<GenericValue, ArrayStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof arrayStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): ArrayStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const ArrayStructure = createStructure(
	arrayStructureKind,
	({ init }) => <
		GenericElement extends Structure,
		const GenericConstraints extends readonly Constraint<
			readonly StructureValue<GenericElement>[]
		>[],
	>(
		element: GenericElement,
		constraints: GenericConstraints,
	) => init<
		ArrayStructure<
			readonly StructureValue<GenericElement>[],
			readonly [...GenericConstraints]
		>
	>(
		{
			element,
			constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => {
				if (!Array.isArray(data)) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const result = data.reduce<
					DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
				>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`[array: ${index}]`) ?? DCommon.callThen(
							self.definition.element.executeCheck(value, errorHandler),
							(result) => result === ErrorSymbol || awaitedAccumulator === ErrorSymbol
								? ErrorSymbol
								: SuccessSymbol,
						),
					),
					SuccessSymbol,
				);

				return DCommon.callThen(
					result,
					(awaitedResult) => {
						pathStage?.close();
						return awaitedResult;
					},
				);
			},
			executeEncode: (self, codecContext, data, errorHandler) => {
				if (!Array.isArray(data)) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const encodedData = data.reduce<unknown>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`[array: ${index}]`) ?? DCommon.callThen(
							self.definition.element.executeEncode(codecContext, value, errorHandler),
							(encodedData) => {
								if (encodedData === ErrorSymbol || awaitedAccumulator === ErrorSymbol) {
									return ErrorSymbol;
								}

								(awaitedAccumulator as unknown[])[index] = encodedData;

								return awaitedAccumulator;
							},
						),
					),
					[],
				);

				return DCommon.callThen(
					encodedData,
					(awaitedEncodedData) => pathStage?.close() ?? (
						awaitedEncodedData === ErrorSymbol
							? ErrorSymbol
							: DCommon.callThen(
								self.executeConstraints(data, errorHandler),
								(result) => result === ErrorSymbol
									? ErrorSymbol
									: awaitedEncodedData,
							)
					),
				);
			},
			executeDecode: (self, codecContext, data, errorHandler) => {
				if (!Array.isArray(data)) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const decodedData = data.reduce<unknown>(
					(accumulator, value, index) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`[array: ${index}]`) ?? DCommon.callThen(
							self.definition.element.executeDecode(codecContext, value, errorHandler),
							(decodedData) => {
								if (decodedData === ErrorSymbol || awaitedAccumulator === ErrorSymbol) {
									return ErrorSymbol;
								}

								(awaitedAccumulator as unknown[])[index] = decodedData;

								return awaitedAccumulator;
							},
						),
					),
					[],
				);

				return DCommon.callThen(
					decodedData,
					(awaitedDecodedData) => pathStage?.close() ?? (
						awaitedDecodedData === ErrorSymbol
							? ErrorSymbol
							: DCommon.callThen(
								self.executeConstraints(awaitedDecodedData, errorHandler),
								(result) => result === ErrorSymbol
									? ErrorSymbol
									: awaitedDecodedData,
							)
					),
				);
			},
			isAsynchronous: (self) => self.definition.element.isAsynchronous(),
		},
	),
);
