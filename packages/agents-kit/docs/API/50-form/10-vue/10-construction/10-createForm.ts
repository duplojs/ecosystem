/**
 * @title createForm
 *
 * Associer des templates à une fabrique de formulaires Vue.
 */
import { createForm, useMultiLayout, type GetCheckedValue } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";
import { grid } from "../fixtures/templates";

// La fabrique peut servir à plusieurs formulaires ; chaque appel reçoit son champ racine.
const useForm = createForm(grid.useTemplates());

const { component: ContactForm, currentValue, check, reset, dispose } = useForm(
	useMultiLayout({
		email: useTextInput({
			label: "Email",
			dataStructure: DDataStructure.string([DDataStructure.email()]),
		}),
	}),
);

// La saisie brute reste une chaîne ; seul le succès de check garantit le format email.
type _Raw = DCommon.ExpectType<
	typeof currentValue.value,
	{ email: string },
	"strict"
>;
type _Checked = DCommon.ExpectType<
	GetCheckedValue<typeof check>,
	{ email: string & DString.Email },
	"strict"
>;

// Succès avec la valeur validée, ou erreurs associées aux champs.
const result = await check();
void result;

// À monter dans Vue ; son slot par défaut reçoit le bouton de soumission.
void ContactForm;

// Restaure la valeur initiale.
reset();

// Libère les scopes internes lorsque le formulaire n'est plus utilisé.
dispose();
