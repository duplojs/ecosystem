import type * as DKind from "@duplojs/lang/kind";
import type * as DCommon from "@duplojs/lang/common";
import { createKind } from "@scripts/kind";

const cipherKind = createKind("cipher");

export interface Cipher<
	GenericAlgorithm extends string = string,
> extends DKind.Kind<typeof cipherKind> {
	readonly algorithm: GenericAlgorithm;
	encrypt(element: string): DCommon.MaybePromise<string>;
	decrypt(element: string): DCommon.MaybePromise<string>;
}

export interface CreateCipher<
	GenericAlgorithm extends string,
	GenericParams extends unknown,
> {
	readonly algorithm: GenericAlgorithm;
	(params: NoInfer<GenericParams>): Cipher<GenericAlgorithm>;
}

export function factory<
	const GenericAlgorithm extends string,
	GenericMethodsParams extends unknown,
>(
	algorithm: GenericAlgorithm,
	methods: (params: GenericMethodsParams, algorithm: NoInfer<GenericAlgorithm>) => {
		encrypt(element: string): DCommon.MaybePromise<string>;
		decrypt(element: string): DCommon.MaybePromise<string>;
	},
): CreateCipher<GenericAlgorithm, GenericMethodsParams> {
	return Object.assign(
		(params: NoInfer<GenericMethodsParams>) => cipherKind
			.setTo(
				{
					algorithm,
					...methods(params, algorithm),
				} satisfies DKind.Remove<Cipher>,
				undefined,
			),
		{
			algorithm,
		},
	);
}
