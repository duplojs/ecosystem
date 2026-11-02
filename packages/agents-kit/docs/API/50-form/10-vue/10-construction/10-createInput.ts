/**
 * @title createInput
 *
 * Construire un champ à partir d'un composant Vue compatible avec v-model.
 */
import { createInput, type GetFormFieldCheckedValue, type GetFormFieldValue } from "@duplojs/form/vue";
import AddressInput from "./fixtures/AddressInput.vue";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

// AddressInput.vue déclare modelValue comme chaîne et exige la prop hint.
// La fabrique fournit cette prop requise et une valeur initiale inférée depuis le composant.
const useAddressInput = createInput(
	AddressInput,
	{
		defaultValue: "",
		props: {
			hint: "We use this address to contact you.",
			placeholder: "name@example.com",
		},
	},
);

const address = useAddressInput({
	label: "Email",
	props: {
		hint: "Your contact address",
		placeholder: "contact@example.com",
	},
	dataStructure: DDataStructure.string([DDataStructure.email()]),
});

// Les props locales doivent respecter le contrat du composant, y compris ses props requises.
// Elles complètent les props initiales et remplacent les clés communes.
// La validation enrichit le résultat.
type _Raw = DCommon.ExpectType<
	GetFormFieldValue<typeof address>,
	string,
	"strict"
>;
type _Checked = DCommon.ExpectType<
	GetFormFieldCheckedValue<typeof address>,
	string & DString.Email,
	"strict"
>;
