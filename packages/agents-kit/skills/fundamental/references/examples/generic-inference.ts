/**
 * @title Fournir une cible de calcul en contexte générique.
 *
 * Utiliser satisfies avec cast et infer sur un paramètre générique direct.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

declare function defineName<GenericName extends string & DString.MinCharacters<3>>(
	name: GenericName,
): GenericName;

const name = defineName(
	DCommon.cast("Alice") satisfies string & DString.MinCharacters<3>,
);

const literalName = defineName(
	DCommon.infer("Alice") satisfies string & DString.MinCharacters<3>,
);

type _CheckName = DCommon.ExpectType<
	typeof name,
	string & DString.MinCharacters<3>,
	"strict"
>;

type _CheckLiteralName = DCommon.ExpectType<
	typeof literalName,
	"Alice" & DString.MinCharacters<3>,
	"strict"
>;
