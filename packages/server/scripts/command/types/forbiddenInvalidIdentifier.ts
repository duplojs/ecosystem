import type * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

type AlphanumericCharacter = (
	| DString.CharactersRangeStore["a-z" | "A-Z"]
	| DString.Digit
);

type AllowedIdentifierCharacter = (
	| AlphanumericCharacter
	| "_"
	| "-"
);

export type ForbiddenInvalidIdentifier<
	GenericName extends string,
> = DCommon.ContainExtends<GenericName, DCommon.BaseConstraint> extends true
	? DCommon.ComputedTypeError<"Identifier cannot be a constrained string.">
	: DString.IsLiteral<GenericName> extends true
		? DCommon.IsUnion<GenericName> extends true
			? DCommon.ComputedTypeError<"Identifier must be a single string literal.">
			: DCommon.IsEqual<GenericName, ""> extends true
				? DCommon.ComputedTypeError<"Identifier cannot be empty.">
				: DString.StartsWith<GenericName, AlphanumericCharacter> extends true
					? DString.IsAllowedString<GenericName, AllowedIdentifierCharacter> extends true
						? DString.IsAllowedString<GenericName, DString.Digit> extends false
							? unknown
							: DCommon.ComputedTypeError<`Identifier "${GenericName}" cannot contain only digits.`>
						: DCommon.ComputedTypeError<`Identifier "${GenericName}" contains invalid characters (allowed: A-Z, a-z, 0-9, "_" and "-").`>
					: DCommon.ComputedTypeError<`Identifier "${GenericName}" must start with a letter or digit.`>
		: DCommon.ComputedTypeError<"Identifier must be a known string literal.">;
