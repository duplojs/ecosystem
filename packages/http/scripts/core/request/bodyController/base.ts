import { createKind } from "@core/kind";
import { type Request } from "@core/request";
import * as DEither from "@duplojs/lang/either";
import * as DKind from "@duplojs/lang/kind";

export interface BodyControllerParams {
	bodyMaxSize?: number;
}

const bodyReaderKind = createKind<"body-reader", string>("body-reader");

export interface BodyReader<
	GenericName extends string = string,
> extends DKind.Kind<typeof bodyReaderKind, GenericName> {
	read(
		request: Request,
	): Promise<DEither.Success | DEither.Error<Error>>;
}

const bodyReaderImplementationKind = createKind<"body-reader-implementation", string>("body-reader-implementation");

export interface BodyReaderImplementation<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends DKind.Kind<typeof bodyReaderImplementationKind, GenericName> {
	read(
		request: Request,
		params: GenericParams
	): Promise<DEither.Success | DEither.Error<Error>>;
}

const bodyControllerKind = createKind<"body-controller", string>("body-controller");

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

const bodyControllerHandlerKind = createKind("body-controller-handler");

export interface BodyControllerHandler<
	GenericName extends string = string,
	GenericParams extends BodyControllerParams = BodyControllerParams,
> extends DKind.Kind<typeof bodyControllerHandlerKind> {
	readonly name: GenericName;
	create(params: GenericParams): BodyController<GenericName, GenericParams>;
	createReaderImplementation(
		read: BodyReaderImplementation<GenericName, GenericParams>["read"]
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

export function createBodyController<
	GenericName extends string,
	GenericParams extends BodyControllerParams,
>(name: GenericName): BodyControllerHandler<GenericName, GenericParams> {
	return bodyControllerHandlerKind.setTo(
		{
			name,
			create(params) {
				function tryToCreateReader(readerImplementation: BodyReaderImplementation) {
					if (bodyReaderImplementationKind.getValue(readerImplementation) !== name) {
						return DEither.fail();
					}
					return DEither.success(
						bodyReaderKind.setTo(
							{
								read: (request) => readerImplementation.read(request, params),
							} satisfies DKind.Remove<BodyReader<GenericName>>,
							name,
						),
					);
				}
				return bodyControllerKind.setTo<
					DKind.Remove<BodyController<GenericName, GenericParams>>,
					GenericName
				>(
					{
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
					},
					name,
				);
			},
			createReaderImplementation(read) {
				return bodyReaderImplementationKind.setTo(
					{ read },
					name,
				);
			},
			is(input) {
				return bodyControllerKind.has(input) && bodyControllerKind.getValue(input) === name;
			},
		} satisfies DKind.Remove<BodyControllerHandler<GenericName, GenericParams>>,
		null,
	);
}
