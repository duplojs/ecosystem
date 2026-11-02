/**
 * @title useUnionLayout
 *
 * Choisir une variante de champ et conserver sa valeur associée.
 */
import { createForm, useUnionLayout } from "@duplojs/form/vue";
import { useNumberInput, useTextInput } from "@duplojs/form/vueDesignSystem";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import { grid } from "../fixtures/templates";

const useForm = createForm(grid.useTemplates());
const { currentValue, check, dispose } = useForm(
	useUnionLayout(
		[
			["email", useTextInput({ label: "Email" })],
			["pickup", useNumberInput({ label: "Pickup point" })],
		],
		{ defaultKind: "email" },
	),
);

// La valeur explicite correspond au kind choisi ; le retour à email restaure sa saisie précédente.
currentValue.value.value = "contact@example.com";
currentValue.value.updateKind("pickup", 42);
currentValue.value.updateKind("email");

const result = await check();
if (DEither.isRight(result)) {
	const delivery = DEither.unwrapRight(result);

	// La valeur validée correspond à la variante active, sans la méthode updateKind.
	if (delivery.kind === "email") {
		type _Email = DCommon.ExpectType<
			typeof delivery.value,
			string,
			"strict"
		>;
	} else {
		type _Pickup = DCommon.ExpectType<
			typeof delivery.value,
			number,
			"strict"
		>;
	}
}

dispose();
