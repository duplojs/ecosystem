import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { createGetErrorHandler, ErrorSymbol, type GetErrorHandler, SuccessSymbol, type EncodedValue, type CodecContext, type Error, type Codecs } from "../common";
import { type Constraint } from "../constraint";
import { type StructureConstraintsValue, type StructureValue } from "./types";

export class StructureClass {
	private constructor() {}

	public static init(params: DKind.Remove<Structure>) {
		const self = new StructureClass();
		DCommon.bindPrototypeMethods(self);
		for (const key in params) {
			self[key as never] = params[key as never];
		}

		return self as Structure;
	}

	public static addToPrototype<
		GenericProp extends keyof Structure,
	>(
		prop: GenericProp,
		value: Structure[GenericProp] extends infer InferredValue
			? InferredValue extends DCommon.AnyFunction
				? (self: Structure, ...rest: Parameters<InferredValue>) => ReturnType<InferredValue>
				: Structure[GenericProp]
			: never,
	) {
		StructureClass.prototype[prop as never] = (
			typeof value === "function"
				? function(this: never, ...args: never[]) {
					return (value as DCommon.AnyFunction)(this as never, ...args);
				}
				: value
		) as never;
	}
}

export const structureKind = createKind("structure");

export interface StructureDefinition<
	GenericConstraints extends readonly Constraint<any>[] = readonly Constraint<any>[],
> {
	readonly message?: string;
	readonly constraints: readonly [...GenericConstraints];
}

export interface Structure<
	out GenericValue extends unknown = unknown,
	out GenericDefinition extends StructureDefinition<
		readonly Constraint<unknown, GenericValue>[]
	> = StructureDefinition<readonly Constraint<unknown, GenericValue>[]>,
> extends DKind.Kind<
		typeof structureKind,
		(
			& GenericValue
			& StructureConstraintsValue<
				GenericDefinition["constraints"][number]
			>
		)
	> {
	readonly definition: GenericDefinition;
	addConstraint<
		const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>,
	>(
		...args: DCommon.FixDeepFunctionInfer<
			DCommon.AnyTuple<Constraint<GenericValue>>,
			GenericNewConstraints
		>
	): Structure<
		StructureValue<this>,
		StructureDefinition<
			readonly [...this["definition"]["constraints"], ...GenericNewConstraints]
		>
	>;
	executeConstraints(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeCheck(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeEncode(
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler
	): unknown;
	executeDecode(
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler
	): unknown;
	isAsynchronous(): boolean;
	check(data: unknown): (
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"check-error", Error>
	);
	asyncCheck(data: unknown): Promise<
		| DEither.Right<"check-success", StructureValue<this>>
		| DEither.Left<"check-error", Error>
	>;
	is(
		data: unknown,
	): data is StructureValue<this>;
	encode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"encode-error", Error>
	);
	asyncEncode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: StructureValue<this>,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs>
		>
		| DEither.Left<"encode-error", Error>
	>;
	unsafeEncode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"encode-error", Error>
	);
	asyncUnsafeEncode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<StructureValue<this>, GenericCodecs>
		>
		| DEither.Left<"encode-error", Error>
	>;
	decode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs>,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"decode-error", Error>
	);
	asyncDecode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: EncodedValue<StructureValue<this>, GenericCodecs>,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", Error>
	>;
	unsafeDecode(
		codecs: Codecs,
		data: unknown,
	): (
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"async-error", undefined>
		| DEither.Left<"decode-error", Error>
	);
	asyncUnsafeDecode(
		codecs: Codecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"decode-success",
			StructureValue<this>
		>
		| DEither.Left<"decode-error", Error>
	>;
	contract<
		GenericValue extends unknown,
		GenericThis extends this,
	>(
		...args: DCommon.IsEqual<StructureValue<GenericThis>, GenericValue> extends true
			? []
			: [] & DCommon.ComputedTypeError<"Contract error.">
	): Structure<GenericValue>;
	clone(): this;
	setMessage(massage: string): this;
	addMessage(massage: string): this;
}

export interface CreateStructureInitParams<
	GenericStructure extends Structure = Structure,
> {
	executeCheck(
		self: GenericStructure,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): DCommon.MaybePromise<
		| SuccessSymbol
		| ErrorSymbol
	>;
	executeEncode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): unknown;
	executeDecode(
		self: GenericStructure,
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler,
	): unknown;
	isAsynchronous(self: GenericStructure): boolean;
}

export type CreateStructureInitRest<
	GenericStructure extends Structure = Structure,
> = {
	[Prop in Exclude<keyof GenericStructure, keyof Structure>]: GenericStructure[Prop] extends DCommon.AnyFunction
		? (self: GenericStructure, ...args: Parameters<GenericStructure[Prop]>) => ReturnType<GenericStructure[Prop]>
		: GenericStructure[Prop]
};

export interface CreateStructureConstructorParams<
	GenericKindHandler extends DKind.Handler = DKind.Handler,
> {
	init<
		GenericStructure extends (
			& Structure
			& DKind.Kind<GenericKindHandler>
		),
	>(
		definition: GenericStructure["definition"],
		params: CreateStructureInitParams<GenericStructure>,
		...args: DCommon.IsNever<Exclude<keyof GenericStructure, keyof Structure>> extends true
			? []
			: [rest: CreateStructureInitRest<GenericStructure>]
	): NoInfer<GenericStructure>;
}

export function createStructure<
	GenericKindHandler extends DKind.Handler,
	GenericConstructor extends (
		(...args: any[]) => (
			& Structure
			& DKind.Kind<GenericKindHandler>
		)
	),
>(
	kindHandler: GenericKindHandler,
	createConstructor: (
		params: CreateStructureConstructorParams<
			GenericKindHandler
		>,
	) => GenericConstructor,
): GenericConstructor {
	const init: CreateStructureConstructorParams["init"] = (
		definition,
		{
			executeCheck,
			executeEncode,
			executeDecode,
			isAsynchronous,
		},
		...rest
	) => {
		let cachedIsAsynchronous: undefined | boolean = undefined;
		const self = StructureClass.init({
			...Object.fromEntries(
				Object
					.entries(rest[0] ?? {})
					.map(
						([key, prop]) => typeof prop === "function"
							? [key, (...args: never[]) => (prop as DCommon.AnyFunction)(self, ...args)]
							: [key, prop],
					),
			),
			definition,
			addConstraint: (...args) => init(
				{
					...definition,
					constraints: [
						...definition.constraints,
						...args,
					],
				},
				{
					executeCheck,
					executeEncode,
					executeDecode,
					isAsynchronous,
				},
				...rest,
			) as never,
			executeConstraints: (data, errorHandler) => definition.constraints.reduce<
				DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>
			>(
				(accumulator, constraint) => DCommon.callThen(
					accumulator,
					(result) => result === ErrorSymbol
						? ErrorSymbol
						: DCommon.callThen(
							constraint.executeCheck(data as never),
							(constraintResult) => constraintResult === ErrorSymbol
								? errorHandler?.().addIssue(self, data, constraint) ?? ErrorSymbol
								: SuccessSymbol,
						),
				),
				SuccessSymbol,
			),
			executeCheck: (data, errorHandler) => DCommon.callThen(
				executeCheck(self as never, data, errorHandler),
				(result) => result === ErrorSymbol
					? ErrorSymbol
					: self.executeConstraints(data, errorHandler),
			),
			executeEncode: (codecContext, data, errorHandler) => executeEncode(
				self as never,
				codecContext,
				data,
				errorHandler,
			),
			executeDecode: (codecContext, data, errorHandler) => executeDecode(
				self as never,
				codecContext,
				data,
				errorHandler,
			),
			isAsynchronous: () => {
				if (cachedIsAsynchronous !== undefined) {
					return cachedIsAsynchronous;
				}
				cachedIsAsynchronous = false;
				cachedIsAsynchronous = self.definition.constraints.some(
					(value) => value.isAsynchronous(),
				);
				if (cachedIsAsynchronous) {
					return cachedIsAsynchronous;
				}
				cachedIsAsynchronous = isAsynchronous(self as never);
				return cachedIsAsynchronous;
			},
			check: (data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeCheck(
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("check-error", errorHandler().createError());
				}

				return DEither.right("check-success", data);
			},
			asyncCheck: async(data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeCheck(
					data,
					errorHandler,
				);
				if (result === ErrorSymbol) {
					return DEither.left("check-error", errorHandler().createError());
				}

				return DEither.right("check-success", data);
			},
			is: (data): data is never => {
				const result = self.executeCheck(data);
				if (result instanceof Promise || result === ErrorSymbol) {
					return false;
				}

				return true;
			},
			encode: (codecs, data) => self.unsafeEncode(codecs, data),
			asyncEncode: (codecs, data) => self.asyncUnsafeEncode(codecs, data),
			unsafeEncode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeEncode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", errorHandler().createError());
				}

				return DEither.right("encode-success", result as never);
			},
			asyncUnsafeEncode: async(codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeEncode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", errorHandler().createError());
				}

				return DEither.right("encode-success", result as never);
			},
			decode: (codecs, data) => self.unsafeDecode(codecs, data),
			asyncDecode: (codecs, data) => self.asyncUnsafeDecode(codecs, data),
			unsafeDecode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeDecode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", errorHandler().createError());
				}

				return DEither.right("decode-success", result as never);
			},
			asyncUnsafeDecode: async(codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeDecode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", errorHandler().createError());
				}

				return DEither.right("decode-success", result as never);
			},
			contract: () => self as never,
			clone: () => init(
				DCommon.simpleClone(definition),
				{
					executeCheck,
					executeEncode,
					executeDecode,
					isAsynchronous,
				},
				...rest,
			),
			setMessage: (message) => {
				(self.definition.message as any) = message as any;
				return self;
			},
			addMessage: (message) => {
				const cloneSelf = self.clone();
				return cloneSelf.setMessage(message);
			},
			[kindHandler.runTimeKey]: null,
			[structureKind.runTimeKey]: null,
		});

		return self as never;
	};

	return createConstructor({
		init,
	});
}
