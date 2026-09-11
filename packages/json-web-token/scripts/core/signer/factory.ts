import type * as DKind from "@duplojs/lang/kind";
import type * as DCommon from "@duplojs/lang/common";
import { createKind } from "@scripts/kind";

const signerKind = createKind("signer");

export interface Signer<
	GenericAlgorithm extends string = string,
> extends DKind.Kind<typeof signerKind> {
	readonly algorithm: GenericAlgorithm;
	sign(content: string): DCommon.MaybePromise<string>;
	verify(content: string, signature: string): DCommon.MaybePromise<boolean>;
}

export interface CreateSigner<
	GenericAlgorithm extends string,
	GenericParams extends unknown,
> {
	readonly algorithm: GenericAlgorithm;
	(params: NoInfer<GenericParams>): Signer<GenericAlgorithm>;
}

export function factory<
	const GenericAlgorithm extends string,
	GenericMethodsParams extends unknown,
>(
	algorithm: GenericAlgorithm,
	methods: (params: GenericMethodsParams, algorithm: NoInfer<GenericAlgorithm>) => {
		sign(content: string): DCommon.MaybePromise<string>;
		verify(content: string, signature: string): DCommon.MaybePromise<boolean>;
	},
): CreateSigner<GenericAlgorithm, GenericMethodsParams> {
	return Object.assign(
		(params: NoInfer<GenericMethodsParams>) => signerKind
			.setTo(
				{
					algorithm,
					...methods(params, algorithm),
				} satisfies DKind.Remove<Signer>,
				undefined,
			),
		{
			algorithm,
		},
	);
}
