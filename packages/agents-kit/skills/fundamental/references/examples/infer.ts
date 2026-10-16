/**
 * @title Conserver une valeur littérale contrainte.
 *
 * Garder le littéral lors de la déclaration d’une propriété.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DString from "@duplojs/lang/string";

declare function defineSettings<GenericSettings extends {
	name: string & DString.MinCharacters<3>;
}>(settings: GenericSettings): GenericSettings;

const settings = defineSettings({
	name: DCommon.infer("Alice"),
});

type _CheckName = DCommon.ExpectType<
	typeof settings.name,
	"Alice" & DString.MinCharacters<3>,
	"strict"
>;
