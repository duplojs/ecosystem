/**
 * @title DDataStructure.createCodec
 *
 * Définir la conversion entre la valeur interne d’un type fondamental et sa représentation encodée.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DString from "@duplojs/lang/string";

// Ce codec représente les nombres en chaînes numériques.
// Le prédicat décrit la forme encodée que `decode` accepte et que `encode`
// doit produire.
const numberStringCodec = DDataStructure.createCodec(
	DDataStructure.TheNumber,
	(data): data is string => (
		typeof data === "string"
		&& DString.isNumber(data)
	),
	(number) => number.toString(),
	(encodedNumber) => Number(encodedNumber),
);

// Le type du codec conserve à la fois le type fondamental représenté
// et le type de sa valeur externe.
type _CheckCodec = DCommon.ExpectType<
	typeof numberStringCodec,
	DDataStructure.Codec<DDataStructure.TheNumber, string>,
	"strict"
>;

// `predicateEncode` est également un prédicat TypeScript pour la valeur encodée.
const unknownEncodedValue: unknown = "42";
if (numberStringCodec.predicateEncode(unknownEncodedValue)) {
	type _CheckEncodedValue = DCommon.ExpectType<
		typeof unknownEncodedValue,
		string,
		"strict"
	>;
}

// `encode` transforme une valeur du type fondamental en représentation externe.
const encodedValue = numberStringCodec.encode(42);

// `decode` vérifie la représentation externe puis reconstruit la valeur interne.
const decodedValue = numberStringCodec.decode("42");
