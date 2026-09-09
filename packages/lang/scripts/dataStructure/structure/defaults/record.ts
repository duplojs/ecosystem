import type * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import { type Constraint } from "../../constraint";
import { createStructure, type StructureDefinition, type Structure } from "../base";
import { createKind } from "../../kind";
import { ErrorSymbol, SuccessSymbol } from "../../common";
import { type StructureValue } from "../types";
import { unionStructureKind, type UnionStructure } from "./union";
import { typeStructureKind, type TypeStructure } from "./type";
import { structureIdentifier } from "../identifier";
import { stringLiteralTypeKind, stringTypeKind, typeIdentifier } from "../../type";

export type RecordStructureValue<
	GenericKey extends Structure<string>,
	GenericValue extends Structure,
> = {
	readonly [Prop in StructureValue<GenericKey>]: StructureValue<GenericValue>
} extends infer InferredResult extends Record<string, unknown>
	? {} extends InferredResult
		? Partial<InferredResult>
		: undefined extends InferredResult[keyof InferredResult]
			? Partial<InferredResult>
			: InferredResult
	: never;

export const recordStructureKind = createKind("record-structure");

export interface RecordStructureDefinition<
	GenericConstraints extends readonly Constraint[] = readonly Constraint[],
> extends StructureDefinition<GenericConstraints> {
	readonly key: UnionStructure<string> | TypeStructure<string>;
	readonly value: Structure;
	readonly requiredKeys: DCommon.Memoized<string[] | null>;
}

export interface RecordStructure<
	out GenericValue extends Record<string, unknown> = Record<string, unknown>,
	out GenericConstraints extends readonly Constraint<GenericValue>[] =
		readonly Constraint<GenericValue>[],
> extends DCommon.Forward<
		& Structure<GenericValue, RecordStructureDefinition<GenericConstraints>>
		& DKind.Kind<typeof recordStructureKind>
	> {

	/*
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: GenericNewConstraints
	): RecordStructure<
		GenericValue,
		readonly [...GenericConstraints, ...GenericNewConstraints]
	>;
	*/
}

export const RecordStructure = createStructure(
	recordStructureKind,
	({ init }) => <
		GenericKey extends (
			| UnionStructure<string>
			| TypeStructure<string>
		),
		GenericValueStructure extends Structure,
		const GenericConstraints extends readonly Constraint<
			RecordStructureValue<
				GenericKey,
				GenericValueStructure
			>
		>[],
	>(
		key: GenericKey,
		value: GenericValueStructure,
		constraints: GenericConstraints,
	) => init<
		RecordStructure<
			RecordStructureValue<
				GenericKey,
				GenericValueStructure
			>,
			readonly [...GenericConstraints]
		>
	>(
		{
			key,
			value,
			constraints,
			requiredKeys: DCommon.memo(() => {
				if (structureIdentifier(key, unionStructureKind)) {
					if (
						key.definition.values.value
							.some(
								(value) => structureIdentifier(value, typeStructureKind)
								&& typeIdentifier(value.definition.type, stringTypeKind),
							)
					) {
						return null;
					}

					return key.definition.values.value
						.map(
							(value) => structureIdentifier(value, typeStructureKind)
								&& typeIdentifier(value.definition.type, stringLiteralTypeKind)
								? value.definition.type.definition.value
								: null,
						)
						.filter(DCommon.isType("string"));
				}

				if (
					structureIdentifier(key, typeStructureKind)
					&& typeIdentifier(key.definition.type, stringLiteralTypeKind)
				) {
					return [key.definition.type.definition.value];
				}

				return null;
			}),
		},
		{
			executeCheck: (self, data, errorHandler) => {
				if (
					typeof data !== "object"
					|| data === null
					|| (
						data.constructor !== undefined
						&& data.constructor.name !== "Object"
					)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const keyData = Object.keys(data);
				const requiredKeys = self.definition.requiredKeys.value;
				if (
					requiredKeys
					&& keyData
						.some((value) => !requiredKeys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const result = (requiredKeys ?? keyData).reduce<
					DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
				>(
					(accumulator, key) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`{record key: ${key}}`) ?? DCommon.callThen(
							self.definition.key.executeCheck(key, errorHandler),
							(resultKey) => pathStage?.setCurrentPath(`{record value: ${key}}`) ?? DCommon.callThen(
								self.definition.value.executeCheck(data[key as never], errorHandler),
								(resultValue) => resultValue === ErrorSymbol
								|| resultKey === ErrorSymbol
								|| awaitedAccumulator === ErrorSymbol
									? ErrorSymbol
									: SuccessSymbol,
							),
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
					typeof data !== "object"
					|| data === null
					|| (
						data.constructor !== undefined
						&& data.constructor.name !== "Object"
					)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const keyData = Object.keys(data);
				const requiredKeys = self.definition.requiredKeys.value;
				if (
					requiredKeys
					&& keyData
						.some((value) => !requiredKeys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const encodedData = (requiredKeys ?? keyData).reduce<unknown>(
					(accumulator, key) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`{record key: ${key}}`) ?? DCommon.callThen(
							self.definition.key.executeCheck(key, errorHandler),
							(keyResult) => pathStage?.setCurrentPath(`{record value: ${key}}`) ?? DCommon.callThen(
								self.definition.value.executeEncode(codecContext, data[key as never], errorHandler),
								(encodedValue) => {
									if (
										keyResult === ErrorSymbol
										|| encodedValue === ErrorSymbol
										|| awaitedAccumulator === ErrorSymbol
									) {
										return ErrorSymbol;
									}

									(awaitedAccumulator as Record<string, unknown>)[key] = encodedValue;

									return awaitedAccumulator;
								},
							),
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
					typeof data !== "object"
					|| data === null
					|| (
						data.constructor !== undefined
						&& data.constructor.name !== "Object"
					)
					|| Object.getOwnPropertySymbols(data).length !== 0
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const keyData = Object.keys(data);
				const requiredKeys = self.definition.requiredKeys.value;
				if (
					requiredKeys
					&& keyData
						.some((value) => !requiredKeys.includes(value))
				) {
					return errorHandler?.().addIssue(self, data) ?? ErrorSymbol;
				}

				const pathStage = errorHandler?.().createPathStage();

				const decodedData = (requiredKeys ?? keyData).reduce<unknown>(
					(accumulator, key) => DCommon.callThen(
						accumulator,
						(awaitedAccumulator) => pathStage?.setCurrentPath(`{record key: ${key}}`) ?? DCommon.callThen(
							self.definition.key.executeCheck(key, errorHandler),
							(keyResult) => pathStage?.setCurrentPath(`{record value: ${key}}`) ?? DCommon.callThen(
								self.definition.value.executeDecode(codecContext, data[key as never], errorHandler),
								(decodedValue) => {
									if (
										keyResult === ErrorSymbol
										|| decodedValue === ErrorSymbol
										|| awaitedAccumulator === ErrorSymbol
									) {
										return ErrorSymbol;
									}

									(awaitedAccumulator as Record<string, unknown>)[key] = decodedValue;

									return awaitedAccumulator;
								},
							),
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
			isAsynchronous: (self) => self.definition.key.isAsynchronous()
				|| self.definition.value.isAsynchronous(),
		},
	),
);
