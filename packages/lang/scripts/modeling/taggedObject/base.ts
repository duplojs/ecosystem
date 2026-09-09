import * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DDataStructure from "@scripts/dataStructure";
import * as DObject from "@scripts/object";
import { createKind } from "../kind";
import { type NewType, type NewTypeMap } from "../newType";
import { entityKind } from "../entity";

declare module "@scripts/dataStructure" {
	interface StructuresStore {
		taggedObject: TaggedObjectStructure;
	}
}

declare module "@scripts/dataStructure/common" {
	interface EncodeStructure<
		GenericValue extends unknown,
		GenericCodecs extends DDataStructure.Codecs,
	> {
		taggedObject: GenericValue extends ObjectTag<infer InferredName>
			? (
				& ObjectTag<InferredName>
				& {
					[Prop in Exclude<keyof GenericValue, DKind.KeySymbol>]: DDataStructure.EncodedValue<
						GenericValue[Prop],
						GenericCodecs
					>
				}
			)
			: never;
	}
}

export const objectTagKind = createKind<
	"object-tag",
	string
>("object-tag");

export interface ObjectTag<
	GenericValue extends string = string,
> extends DKind.Kind<typeof objectTagKind, GenericValue> {

}

export type GetTagValue<
	GenericTaggedObject extends ObjectTag,
> = DKind.GetValue<
	typeof objectTagKind,
	GenericTaggedObject
>;

export type ExtractByTagValue<
	GenericValue extends unknown,
	GenericTagValue extends string,
> = GenericValue extends ObjectTag<GenericTagValue>
	? GenericValue
	: never;

export type ShapeTaggedObjectStructure<
	GenericTaggedObject extends ObjectTag = ObjectTag,
> = {
	[Prop in Extract<keyof GenericTaggedObject, string>]: DDataStructure.Structure<GenericTaggedObject[Prop]>
};

export const taggedObjectStructureKind = createKind("tagged-object-structure");

export interface TaggedObjectStructureDefinition extends DDataStructure.StructureDefinition<readonly []> {
	readonly inner: DDataStructure.ObjectStructure;
}

export type TaggedObjectMap<
	GenericValue extends unknown,
	GenericRawValue = DCommon.RemoveConstraint<GenericValue>,
> = GenericRawValue extends NewType
	? NewTypeMap<GenericRawValue>
	: GenericRawValue extends object
		? DCommon.Or<[
			DCommon.IsExtends<GenericRawValue, readonly any[]>,
			DCommon.And<[
				DCommon.IsExtends<keyof GenericRawValue, string>,
				DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericRawValue[keyof GenericRawValue]>>,
			]>,
		]> extends true
			? { [Prop in keyof GenericRawValue]: TaggedObjectMap<GenericRawValue[Prop]> }
			: GenericRawValue
		: GenericRawValue;

export type TaggedObjectUpdate<
	GenericTaggedObject extends ObjectTag,
	GenericNewProperties extends object,
> = Extract<
	(
		& ObjectTag<GetTagValue<GenericTaggedObject>>
		& DCommon.SimplifyTopLevel<
			DKind.Remove<GenericTaggedObject> extends infer InferredProperties
				? {
					[Prop in keyof InferredProperties]: Prop extends keyof GenericNewProperties
						? GenericNewProperties[Prop] extends infer InferredNewValue
							? InferredNewValue extends undefined
								? InferredProperties[Prop]
								: InferredNewValue
							: never
						: InferredProperties[Prop]
				}
				: never
		>
	),
	any
>;

export interface TaggedObjectStructure<
	out GenericTaggedObject extends ObjectTag = ObjectTag,
> extends DCommon.Forward<
		& DDataStructure.Structure<
			GenericTaggedObject,
			TaggedObjectStructureDefinition
		>
		& DKind.Kind<typeof taggedObjectStructureKind>
	> {
	readonly name: GetTagValue<GenericTaggedObject>;

	"new"(
		properties: DCommon.SimplifyTopLevel<DKind.Remove<GenericTaggedObject>>
	): GenericTaggedObject;

	decodeMap<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
	): (
		data: DDataStructure.EncodedValue<
			TaggedObjectMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
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
			TaggedObjectMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
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
		data: TaggedObjectMap<
			DKind.Remove<
				DDataStructure.StructureValue<this>
			>
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
			TaggedObjectMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
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
			TaggedObjectMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
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
		data: TaggedObjectMap<
			DKind.Remove<
				DDataStructure.StructureValue<this>
			>
		>
	): Promise<
		| DEither.Right<
			"map-success",
			DDataStructure.StructureValue<this>
		>
		| DEither.Left<"map-error", DDataStructure.Error>
	>;

	encodeTaggedObject<
		GenericCodecs extends DDataStructure.Codecs,
	>(
		codecs: GenericCodecs,
		data: DDataStructure.StructureValue<this>,
	): Promise<
		DDataStructure.EncodedValue<
			TaggedObjectMap<
				DKind.Remove<
					DDataStructure.StructureValue<this>
				>
			>,
			GenericCodecs
		>
	>;

	update<
		GenericInput extends GenericTaggedObject,
		const GenericPayload extends Partial<DKind.Remove<GenericTaggedObject>>,
	>(
		update: GenericPayload
	): (
		input: GenericInput,
	) => TaggedObjectUpdate<GenericInput, GenericPayload>;

	update<
		GenericInput extends GenericTaggedObject,
		const GenericPayload extends Partial<DKind.Remove<GenericTaggedObject>>,
	>(
		input: GenericInput,
		update: GenericPayload
	): TaggedObjectUpdate<GenericInput, GenericPayload>;
}

export class EncodeTaggedObjectError extends DKind.parentClass(
	createKind("encode-tagged-object-error"),
	Error,
) {
	public constructor(
		public error: DDataStructure.Error,
	) {
		super(undefined, "An error occurred while encoding a TaggedObject. This can only happen if you are bypassing the type system.");
	}
}

export const TaggedObjectStructure = DDataStructure.createStructure(
	taggedObjectStructureKind,
	({ init }) => <
		GenericTaggedObject extends ObjectTag,
		GenericName extends string = never,
		GenericShape extends DDataStructure.ShapeObjectStructure = never,
	>(
		name: GetTagValue<GenericTaggedObject> | GenericName,
		shape: ShapeTaggedObjectStructure<GenericTaggedObject> | GenericShape,
	): TaggedObjectStructure<
		ObjectTag extends GenericTaggedObject
			? (
				& ObjectTag<GenericName>
				& DDataStructure.ShapeObjectStructureValue<GenericShape>
			)
			: GenericTaggedObject
	> => init<
		TaggedObjectStructure
	>(
		{
			inner: DDataStructure.ObjectStructure(
				{
					...shape,
					[objectTagKind.runTimeKey]: DDataStructure.NonEncodableStringStructure(name),
				},
				[],
			),
			constraints: [],
		},
		{
			executeCheck: (self, data, errorHandler) => self.definition.inner.executeCheck(data, errorHandler),
			executeEncode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.executeEncode(codecContext, data, errorHandler),
			executeDecode: (
				self,
				codecContext,
				data,
				errorHandler,
			) => self.definition.inner.executeDecode(codecContext, data, errorHandler),
			isAsynchronous: (self) => self.definition.inner.isAsynchronous(),
		},
		{
			name,
			new: (self, properties) => ({
				...properties,
				[objectTagKind.runTimeKey]: name,
			}) as never,
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
					DObject.isSimple(data)
						? {
							...data,
							[objectTagKind.runTimeKey]: name,
						}
						: data,
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

				const formattedData = DObject.isSimple(data)
					? {
						...data,
						[objectTagKind.runTimeKey]: name,
					}
					: data;

				const result = self.executeCheck(
					formattedData,
					errorHandler,
				);

				if (result instanceof Promise) {
					return DEither.left("async-error", undefined);
				}

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", formattedData as never);
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
						DObject.isSimple(data)
							? {
								...data,
								[objectTagKind.runTimeKey]: name,
							}
							: data,
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

				const formattedData = DObject.isSimple(data)
					? {
						...data,
						[objectTagKind.runTimeKey]: name,
					}
					: data;

				const result = await self.executeCheck(
					formattedData,
					errorHandler,
				);

				if (result === DDataStructure.ErrorSymbol) {
					return DEither.left("map-error", errorHandler().createError());
				}

				return DEither.right("map-success", formattedData as never);
			},
			encodeTaggedObject: async(self, codecs, data) => {
				const result = await self.asyncEncode(codecs, data);

				if (DEither.isLeft(result)) {
					throw new EncodeTaggedObjectError(
						DEither.unwrapLeft(result),
					);
				}

				return DEither.unwrapRight(result);
			},
			update: (
				self,
				...args: | [update: object]
					| [input: object, update: object]
			): any => {
				if (args.length === 1) {
					const [update] = args;

					return (input: object) => self.update(input as never, update as never);
				}

				const [input, { [entityKind.runTimeKey as never]: __, ...update }] = args;

				return DObject.override(input, update);
			},
		},
	) as never,
);
