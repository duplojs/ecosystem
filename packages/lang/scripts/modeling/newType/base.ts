import * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import type * as DArray from "@scripts/array";
import * as DEither from "@scripts/either";
import * as DDataStructure from "@scripts/dataStructure";
import { createKind } from "../kind";

declare module "@scripts/dataStructure" {
	interface StructuresStore {
		newType: NewTypeStructure;
	}
}

export interface NewType<
	GenericName extends string = string,
	GenericConstraint extends DCommon.Constraint = never,
> extends DCommon.BaseConstraint<
		DCommon.SimplifyType<
			& Record<"new-type", GenericName>
			& DCommon.UnionToIntersection<
				GenericConstraint[DCommon.ConstraintSymbol]
			>
		>
	> {
}

export type NewTypeMap<
	GenericValue extends unknown,
	GenericRawValue = DCommon.RemoveConstraint<GenericValue>,
> = GenericRawValue extends DDataStructure.FundamentalTypeValue<DDataStructure.FundamentalTypes>
	? GenericRawValue
	: GenericRawValue extends object
		? DCommon.Or<[
			DCommon.IsExtends<GenericRawValue, readonly any[]>,
			DCommon.And<[
				DCommon.IsExtends<keyof GenericRawValue, string>,
				DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>,
			]>,
		]> extends true
			? { [Prop in keyof GenericRawValue]: NewTypeMap<GenericRawValue[Prop]> }
			: GenericRawValue
		: GenericRawValue;

export const newTypeStructureKind = createKind("new-type-structure");

export interface NewTypeStructureDefinition<
	GenericNewTypeConstraint extends readonly DDataStructure.Constraint[] = readonly DDataStructure.Constraint[],
> extends DDataStructure.StructureDefinition<readonly []> {
	readonly inner: DDataStructure.Structure;
	readonly newTypeConstraints: GenericNewTypeConstraint;
}

export type ComputeNewType<
	GenericName extends string,
	GenericValue extends unknown,
	GenericNewTypeConstraint extends readonly DDataStructure.Constraint<GenericValue>[],
	GenericIntersectionConstraintValue = DDataStructure.ConstraintValue<
		DArray.Unwrap<GenericNewTypeConstraint>
	>,
	GenericClearValue = DCommon.NeverCoalescing<
		DCommon.RemoveConstraint<
			GenericIntersectionConstraintValue
		>,
		unknown
	>,
> = (
		& GenericValue
		& GenericClearValue
		& NewType<
			GenericName,
			GenericIntersectionConstraintValue extends (
				& GenericClearValue
				& infer InferredConstraint extends DCommon.BaseConstraint
			)
				? InferredConstraint
				: never
		>
);

export interface NewTypeStructure<
	out GenericName extends string = string,
	out GenericValue extends unknown = unknown,
	out GenericNewTypeConstraint extends readonly DDataStructure.Constraint<GenericValue>[] =
		readonly DDataStructure.Constraint<GenericValue>[],
> extends DCommon.Forward<
		& DDataStructure.Structure<
			ComputeNewType<GenericName, GenericValue, GenericNewTypeConstraint>,
			NewTypeStructureDefinition<GenericNewTypeConstraint>
		>
		& DKind.Kind<typeof newTypeStructureKind>
	> {
	readonly name: GenericName;

	decodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
	): (
		data: DDataStructure.EncodedValue<
			NewTypeMap<
				DDataStructure.StructureValue<this>
			>,
			GenericCodecs
		>,
	) => (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);
	decodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.EncodedValue<
			NewTypeMap<
				DDataStructure.StructureValue<this>
			>,
			GenericCodecs
		>,
	): (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);

	map(
		data: NewTypeMap<
			DDataStructure.StructureValue<this>
		>
	): (
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"map-error", DDataStructure.Error>
	);

	asyncDecodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
	): (
		data: DDataStructure.EncodedValue<
			NewTypeMap<
				DDataStructure.StructureValue<this>
			>,
			GenericCodecs
		>,
	) => Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;
	asyncDecodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.EncodedValue<
			NewTypeMap<
				DDataStructure.StructureValue<this>
			>,
			GenericCodecs
		>,
	): Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;

	asyncMap(
		data: NewTypeMap<
			DDataStructure.StructureValue<this>
		>
	): Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;

	encodeNewType<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.StructureValue<this>,
	): Promise<
		DDataStructure.EncodedValue<
			NewTypeMap<
				DDataStructure.StructureValue<this>
			>,
			GenericCodecs
		>
	>;
}

export class EncodeNewTypeError extends DKind.parentClass(
	createKind("encode-new-type-error"),
	Error,
) {
	public constructor(
		public error: DDataStructure.Error,
	) {
		super(undefined, "An error occurred while encoding a NewType. This can only happen if you are bypassing the type system.");
	}
}

function executeNewTypeConstraints(
	structure: NewTypeStructure,
	data: unknown,
	errorHandler?: DDataStructure.GetErrorHandler,
): DCommon.MaybePromise<
	| DDataStructure.SuccessSymbol
	| DDataStructure.ErrorSymbol
> {
	return structure.definition.newTypeConstraints.reduce<
		DCommon.MaybePromise<DDataStructure.SuccessSymbol | DDataStructure.ErrorSymbol>
	>(
		(accumulator, constraint) => DCommon.callThen(
			accumulator,
			(result) => result === DDataStructure.ErrorSymbol
				? DDataStructure.ErrorSymbol
				: DCommon.callThen(
					constraint.executeCheck(data),
					(constraintResult) => constraintResult === DDataStructure.ErrorSymbol
						? errorHandler?.().addIssue(structure, data, constraint) ?? DDataStructure.ErrorSymbol
						: DDataStructure.SuccessSymbol,
				),
		),
		DDataStructure.SuccessSymbol,
	);
}

export const NewTypeStructure = DDataStructure.createStructure(
	newTypeStructureKind,
	({ init }) => <
		GenericName extends string,
		GenericStructure extends DDataStructure.Structure,
		const GenericNewTypeConstraint extends readonly DDataStructure.Constraint<
			DDataStructure.StructureValue<GenericStructure>
		>[],
	>(
		name: GenericName,
		structure: GenericStructure,
		newTypeConstraints: GenericNewTypeConstraint,
	): NewTypeStructure<
		GenericName,
		DDataStructure.StructureValue<GenericStructure>,
		GenericNewTypeConstraint
	> => init<NewTypeStructure>(
		{
			constraints: [],
			newTypeConstraints,
			inner: structure,
		},
		{
			executeCheck: (self, data, errorHandler) => DCommon.callThen(
				self.definition.inner.executeCheck(
					data,
					errorHandler,
				),
				(result) => result === DDataStructure.ErrorSymbol
					? DDataStructure.ErrorSymbol
					: executeNewTypeConstraints(self, data, errorHandler),
			),
			executeEncode: (self, codec, data, errorHandler) => DCommon.callThen(
				self.definition.inner.executeEncode(
					codec,
					data,
					errorHandler,
				),
				(awaitedInnerResult) => awaitedInnerResult === DDataStructure.ErrorSymbol
					? DDataStructure.ErrorSymbol
					: DCommon.callThen(
						executeNewTypeConstraints(self, data, errorHandler),
						(result) => result === DDataStructure.ErrorSymbol
							? DDataStructure.ErrorSymbol
							: DCommon.callThen(
								self.executeConstraints(data, errorHandler),
								(result) => result === DDataStructure.ErrorSymbol
									? DDataStructure.ErrorSymbol
									: awaitedInnerResult,
							),
					),
			),
			executeDecode: (self, codec, data, errorHandler) => DCommon.callThen(
				self.definition.inner.executeDecode(
					codec,
					data,
					errorHandler,
				),
				(awaitedInnerResult) => awaitedInnerResult === DDataStructure.ErrorSymbol
					? DDataStructure.ErrorSymbol
					: DCommon.callThen(
						executeNewTypeConstraints(self, awaitedInnerResult, errorHandler),
						(result) => result === DDataStructure.ErrorSymbol
							? DDataStructure.ErrorSymbol
							: DCommon.callThen(
								self.executeConstraints(awaitedInnerResult, errorHandler),
								(result) => result === DDataStructure.ErrorSymbol
									? DDataStructure.ErrorSymbol
									: awaitedInnerResult,
							),
					),
			),
			isAsynchronous: (self) => (
				self.definition.inner.isAsynchronous()
				|| self.definition.newTypeConstraints.some(
					(value) => value.isAsynchronous(),
				)
			),
		},
		{
			name,
			decodeMap: (
				self,
				...args: | [DDataStructure.Codecs, unknown]
					| [DDataStructure.Codecs]
			): any => {
				if (args.length === 1) {
					const [codecs] = args;
					return (value: never) => self.decodeMap(codecs, value);
				}

				const errorHandler = DDataStructure.createGetErrorHandler();
				const [codecs, data] = args;

				const result = self.executeDecode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", result as never);
			},
			map: (
				self,
				data,
			): any => {
				const errorHandler = DDataStructure.createGetErrorHandler();

				const result = self.executeCheck(
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", data as never);
			},
			asyncDecodeMap: (
				self,
				...args: | [DDataStructure.Codecs, unknown]
					| [DDataStructure.Codecs]
			): any => {
				if (args.length === 1) {
					const [codecs] = args;
					return (value: never) => self.asyncDecodeMap(codecs, value);
				}
				return DCommon.justExec(async() => {
					const errorHandler = DDataStructure.createGetErrorHandler();
					const [codecs, data] = args;

					const result = await self.executeDecode(
						codecs.context.value,
						data,
						errorHandler,
					);

					if (result === DDataStructure.ErrorSymbol) {
						return DEither.left("map-error", errorHandler().createError());
					}

					return DEither.right("map-success", result as never);
				});
			},
			asyncMap: async(
				self,
				data,
			) => {
				const errorHandler = DDataStructure.createGetErrorHandler();

				const result = await self.executeCheck(
					data,
					errorHandler,
				);

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", data as never);
			},
			encodeNewType: async(self, codec, data) => {
				const result = await self.asyncEncode(codec, data);

				if (DEither.isLeft(result)) {
					throw new EncodeNewTypeError(
						DEither.unwrapLeft(result),
					);
				}

				return DEither.unwrapRight(result);
			},
		},
	) as never,
);
