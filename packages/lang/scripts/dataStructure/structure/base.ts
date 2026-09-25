import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import * as DCommon from "@scripts/common";
import { createKind } from "../kind";
import { createGetErrorHandler, ErrorPromise, ErrorSymbol, type GetErrorHandler, SuccessSymbol, type EncodedValue, type CodecContext, type Error, type Codecs } from "../common";
import { type Constraint } from "../constraint";
import { type ComputeStructureValue } from "./types";

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
		ComputeStructureValue<
			GenericValue,
			GenericDefinition["constraints"]
		>
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
		ComputeStructureValue<
			GenericValue,
			GenericDefinition["constraints"]
		>,
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
	executeParse(
		codecContext: CodecContext,
		data: unknown,
		errorHandler?: GetErrorHandler
	): unknown;
	isAsynchronous(): boolean;
	check(data: unknown): (
		| DEither.Right<
			"check-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"async-error", ErrorPromise>
		| DEither.Left<"check-error", Error>
	);
	asyncCheck(data: unknown): Promise<
		| DEither.Right<
			"check-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"check-error", Error>
	>;
	is(
		data: unknown,
	): data is ComputeStructureValue<
		GenericValue,
		GenericDefinition["constraints"]
	>;
	encode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): (
		| DEither.Right<
			"encode-success",
			EncodedValue<
				ComputeStructureValue<
					GenericValue,
					GenericDefinition["constraints"]
				>,
				GenericCodecs
			>
		>
		| DEither.Left<"async-error", ErrorPromise>
		| DEither.Left<"encode-error", Error>
	);
	asyncEncode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"encode-success",
			EncodedValue<
				ComputeStructureValue<
					GenericValue,
					GenericDefinition["constraints"]
				>,
				GenericCodecs
			>
		>
		| DEither.Left<"encode-error", Error>
	>;
	decode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): (
		| DEither.Right<
			"decode-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"async-error", ErrorPromise>
		| DEither.Left<"decode-error", Error>
	);
	asyncDecode<
		GenericCodecs extends Codecs,
	>(
		codecs: GenericCodecs,
		data: unknown,
	): Promise<
		| DEither.Right<
			"decode-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"decode-error", Error>
	>;
	parse(
		data: unknown,
		codecs?: Codecs,
	): (
		| DEither.Right<
			"parse-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"async-error", ErrorPromise>
		| DEither.Left<"parse-error", Error>
	);
	asyncParse(
		data: unknown,
		codecs?: Codecs,
	): Promise<
		| DEither.Right<
			"parse-success",
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>
		>
		| DEither.Left<"parse-error", Error>
	>;
	contract<
		GenericValue extends unknown,
	>(
		...args: DCommon.IsEqual<
			ComputeStructureValue<
				GenericValue,
				GenericDefinition["constraints"]
			>,
			GenericValue
		> extends true
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
	executeParse(
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
			executeParse,
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
					executeParse,
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
			executeParse: (codecContext, data, errorHandler) => executeParse(
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
					return DEither.left("async-error", new ErrorPromise());
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
			encode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeEncode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", new ErrorPromise());
				}

				if (result === ErrorSymbol) {
					return DEither.left("encode-error", errorHandler().createError());
				}

				return DEither.right("encode-success", result as never);
			},
			asyncEncode: async(codecs, data) => {
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
			decode: (codecs, data) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeDecode(
					codecs.context.value,
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", new ErrorPromise());
				}

				if (result === ErrorSymbol) {
					return DEither.left("decode-error", errorHandler().createError());
				}

				return DEither.right("decode-success", result as never);
			},
			asyncDecode: async(codecs, data) => {
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
			parse: (data, codecs) => {
				const errorHandler = createGetErrorHandler();
				const result = self.executeParse(
					codecs?.context.value ?? new Map(),
					data,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", new ErrorPromise());
				}

				if (result === ErrorSymbol) {
					return DEither.left("parse-error", errorHandler().createError());
				}

				return DEither.right("parse-success", result as never);
			},
			asyncParse: async(data, codecs) => {
				const errorHandler = createGetErrorHandler();
				const result = await self.executeParse(
					codecs?.context.value ?? new Map(),
					data,
					errorHandler,
				);

				if (result === ErrorSymbol) {
					return DEither.left("parse-error", errorHandler().createError());
				}

				return DEither.right("parse-success", result as never);
			},
			contract: () => self as never,
			clone: () => init(
				DCommon.simpleClone(definition),
				{
					executeCheck,
					executeEncode,
					executeDecode,
					executeParse,
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
