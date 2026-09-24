import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";

export const signatureKind = createKind<
	"signature",
	string
>("signature");

export interface Signature<
	GenericName extends string = string,
> extends DKind.Kind<typeof signatureKind, GenericName> {}

export type SignedFunction<
	GenericName extends string = string,
	GenericFunction extends DCommon.AnyFunction = DCommon.AnyFunction,
> = (
	& Signature<GenericName>
	& GenericFunction
);

export function signedFunction<
	GenericName extends string,
	GenericFunction extends DCommon.AnyFunction,
>(
	name: GenericName,
	theFunction: GenericFunction,
): SignedFunction<
	GenericName,
	GenericFunction
> {
	return signatureKind.setTo(
		theFunction,
		name,
	);
}
