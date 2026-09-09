import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import * as DObject from "@scripts/object";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { type StructureValue } from "../types";
import { type Codecs, type EncodedValue, ErrorSymbol, SuccessSymbol } from "../../common";

declare module "../../common" {
	interface EncodeStructure<
		GenericValue extends unknown,
		GenericCodecs extends Codecs,
	> {
		object: GenericValue extends object
			? keyof GenericValue extends string
				? {
					[Prop in keyof GenericValue]: EncodedValue<
						GenericValue[Prop],
						GenericCodecs
					>
				}
				: never
			: never;
	}
}

export type ShapeObjectStructure = Record<
	string,
	Structure
>;

export interface EntryShapeObjectStructure {
	key: string;
	value: Structure;
}

export type ShapeObjectStructureValue<
	GenericShape extends ShapeObjectStructure,
> = {
	readonly [Prop in keyof GenericShape]: StructureValue<
		GenericShape[Prop]
	>
} extends infer InferredResult extends Record<string, unknown>
	? DObject.PartialKeys<
		InferredResult,
		DObject.GetPropsWithValueExtends<
			InferredResult,
			undefined
		>
	>
	: never;

export const objectStructureKind = createKind("object-structure");

export interface ObjectStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly shape: DCommon.Memoized<readonly EntryShapeObjectStructure[]>;
	readonly keys: readonly string[];
}

export interface ObjectStructure<
	out GenericValue extends Record<string, unknown> = Record<string, unknown>,
	out GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.Forward<
		& Structure<GenericValue, ObjectStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof objectStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): ObjectStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const ObjectStructure = createStructure(
	objectStructureKind,
	({ init }) => <
		GenericShape extends ShapeObjectStructure,
		const GenericConstraints extends readonly Constraint<
			ShapeObjectStructureValue<GenericShape>
		>[],
	>(
		shape: GenericShape,
		constraints: GenericConstraints,
	) => init<
		ObjectStructure<
			ShapeObjectStructureValue<GenericShape>,
			readonly [...GenericConstraints]
		>
	>(
		{
			shape: DCommon.memo(
				() => Object
					.entries(shape)
					.map(
						([key, value]) => ({
							key,
							value,
						}),
					),
			),
			keys: Object.keys(shape),
			constraints: constraints,
		},
		{
			executeCheck: (self, data, errorHandler) => {
				if (
					!DObject.isSimple(data)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				if (
					Object.keys(data)
						.some((value) => !self.definition.keys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const result = self.definition.shape.value.reduce<
					DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
				>(
					(accumulator, entry) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(entry.key) ?? DCommon.callThen(
							entry.value.executeCheck(data[entry.key as never], errorHandler),
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
				if (
					!DObject.isSimple(data)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				if (
					Object.keys(data)
						.some((value) => !self.definition.keys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const encodedData = self.definition.shape.value.reduce<unknown>(
					(accumulator, entry) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(entry.key) ?? DCommon.callThen(
							entry.value.executeEncode(codecContext, data[entry.key as never], errorHandler),
							(encodedData) => {
								if (encodedData === ErrorSymbol || awaitedAccumulator === ErrorSymbol) {
									return ErrorSymbol;
								}

								(awaitedAccumulator as Record<string, unknown>)[entry.key] = encodedData;

								return awaitedAccumulator;
							},
						),
					),
					{},
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
				if (
					!DObject.isSimple(data)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				if (
					Object.keys(data)
						.some((value) => !self.definition.keys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const decodedData = self.definition.shape.value.reduce<unknown>(
					(accumulator, entry) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(entry.key) ?? DCommon.callThen(
							entry.value.executeDecode(codecContext, data[entry.key as never], errorHandler),
							(decodedData) => {
								if (decodedData === ErrorSymbol || awaitedAccumulator === ErrorSymbol) {
									return ErrorSymbol;
								}

								(awaitedAccumulator as Record<string, unknown>)[entry.key] = decodedData;

								return awaitedAccumulator;
							},
						),
					),
					{},
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
			isAsynchronous: (self) => self.definition.shape.value.some((entry) => entry.value.isAsynchronous()),
		},
	),
);
