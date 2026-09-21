import { createKind } from "@core/kind";
import { type Request } from "@core/request";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DKind from "@duplojs/lang/kind";

export const bodyResultKind = createKind("body-result");

export interface BodyResult extends DKind.Kind<typeof bodyResultKind> {
	extract<
		GenericStructureParse extends (
			| DDataStructure.Structure["parse"]
			| DDataStructure.Structure["asyncParse"]
		),
	>(
		getValue: (input: unknown) => unknown,
		structureParse: GenericStructureParse,
	): Promise<
		| Awaited<
			ReturnType<GenericStructureParse>
		>
		| DEither.Left<"reader-error", Error>
	>;
}

export const bodyReaderKind = createKind<"body-reader", string>("body-reader");

export interface BodyReader<
	GenericName extends string = string,
> extends DKind.Kind<typeof bodyReaderKind, GenericName> {
	getResult(
		request: Request
	): BodyResult;
}

export const bodyReaderImplementationKind = createKind<"body-reader-implementation", string>("body-reader-implementation");

export interface BodyControllerParams {
	bodyMaxSize?: number;
}

export interface BodyReaderImplementation<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends DKind.Kind<typeof bodyReaderImplementationKind, GenericName> {
	readonly codecs?: DDataStructure.Codecs;
	read(
		request: Request,
		params: GenericParams
	): Promise<
		| DEither.Success
		| DEither.Left<"reader-error", Error>
	>;
}

export const bodyControllerKind = createKind<"body-controller", string>("body-controller");

export interface BodyController<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends DKind.Kind<
		typeof bodyControllerKind,
		GenericName
	> {
	readonly name: GenericName;
	readonly params: GenericParams;
	tryToCreateReader(
		readerImplementation: BodyReaderImplementation
	): DEither.Success<BodyReader<GenericName>> | DEither.Fail;
	createReaderOrThrow(
		readerImplementation: BodyReaderImplementation
	): BodyReader<GenericName>;
}

export const bodyControllerHandlerKind = createKind("body-controller-handler");

export interface BodyControllerHandler<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends DKind.Kind<typeof bodyControllerHandlerKind> {
	readonly name: GenericName;
	create(params: GenericParams): BodyController<GenericName, GenericParams>;
	createReaderImplementation(
		read: BodyReaderImplementation<GenericName, GenericParams>["read"],
		codecs?: DDataStructure.Codecs,
	): BodyReaderImplementation<GenericName, GenericParams>;
	is(input: unknown): input is BodyController<GenericName, GenericParams>;
}

export class WrongBodyReaderImplementationError extends DKind.parentClass(
	createKind("wrong-body-reader-implementation"),
	Error,
) {
	public constructor(
		public controllerName: string,
		public bodyReaderImplementation: BodyReaderImplementation,
	) {
		super(null, "Received wrong body reader implementation.");
	}
}

const PlaceholderResultSymbol = Symbol("PlaceholderResultSymbol");

export function createBodyController<
	GenericName extends string,
	GenericParams extends BodyControllerParams,
>(name: GenericName): BodyControllerHandler<GenericName, GenericParams> {
	return {
		name,
		create: (params) => {
			function tryToCreateReader(readerImplementation: BodyReaderImplementation) {
				if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
					return DEither.fail();
				}
				return DEither.success(
					{
						getResult: (request) => {
							const readerResult = readerImplementation.read(request, params);

							let cacheResult: (
								| Awaited<typeof readerResult>
								| typeof PlaceholderResultSymbol
							) = PlaceholderResultSymbol;

							const extract: BodyResult["extract"] = async(getValue, structureParse) => {
								if (cacheResult !== PlaceholderResultSymbol) {
									if (DEither.isLeft(cacheResult)) {
										return cacheResult;
									}

									return structureParse(
										getValue(
											DEither.unwrapRight(cacheResult),
										),
										readerImplementation.codecs,
									) as never;
								}

								cacheResult = await readerResult;

								return extract(
									getValue,
									structureParse,
								) as never;
							};

							return {
								extract,
								[bodyResultKind.runTimeKey]: null,
							} satisfies DKind.Remove<BodyResult> as never;
						},
						[bodyReaderKind.runTimeKey]: name,
					} satisfies DKind.Remove<BodyReader<GenericName>> as never,
				);
			}

			return {
				name,
				params,
				tryToCreateReader,
				createReaderOrThrow(readerImplementation) {
					const result = tryToCreateReader(readerImplementation);

					if (DEither.isLeft(result)) {
						throw new WrongBodyReaderImplementationError(name, readerImplementation);
					}

					return DEither.unwrapRight(result);
				},
				[bodyControllerKind.runTimeKey]: name,
			} satisfies DKind.Remove<BodyController<GenericName, GenericParams>> as never;
		},
		createReaderImplementation(read, codecs) {
			return bodyReaderImplementationKind.setTo(
				{
					read,
					codecs,
				},
				name,
			);
		},
		is(input) {
			return bodyControllerKind.has(input) && bodyControllerKind.getValue(input) === name;
		},
		[bodyControllerHandlerKind.runTimeKey]: null,
	} satisfies DKind.Remove<BodyControllerHandler<GenericName, GenericParams>> as never;
}
