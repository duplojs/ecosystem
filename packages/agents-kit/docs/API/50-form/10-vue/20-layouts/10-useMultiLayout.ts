/**
 * @title useMultiLayout
 *
 * Assembler plusieurs champs dans une valeur objet.
 */
import { useMultiLayout, type GetFormFieldValue } from "@duplojs/form/vue";
import { useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";

const profile = useMultiLayout({
	name: useTextInput(),
	age: useNumberInput(),
});

// Chaque clé conserve le type de son champ.
type _Raw = DCommon.ExpectType<
	GetFormFieldValue<typeof profile>,
	{
		name: string;
		age: number;
	},
	"strict"
>;

// Les entrées permettent de construire les clés dynamiquement ; leur type devient un dictionnaire.
declare const names: [string, ReturnType<typeof useTextInput>][];
const dynamicFields = useMultiLayout(names);
type _Dynamic = DCommon.ExpectType<
	GetFormFieldValue<typeof dynamicFields>,
	{ [key: string]: string },
	"strict"
>;
