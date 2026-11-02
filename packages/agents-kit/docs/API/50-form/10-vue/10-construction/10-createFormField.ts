/**
 * @title createFormField
 *
 * Construire une primitive de champ personnalisée pour un formulaire Vue.
 */
import { createForm, createFormField, useMultiLayout, type FormField, type FormFieldSlots } from "@duplojs/form/vue";
import { useTextInput } from "@duplojs/form/vueDesignSystem";
import type * as DCommon from "@duplojs/lang/common";
import { grid } from "../fixtures/templates";

// Un layout qui présente un champ dans une section utilise le template du contexte.
// Le champ enfant conserve son modèle et ses garanties de validation.
function useTitledField<GenericValue, GenericChecked, GenericSlots extends FormFieldSlots>(
	field: FormField<GenericValue, GenericChecked, GenericSlots>,
	title: string,
) {
	return createFormField<
		GenericValue,
		GenericChecked,
		GenericSlots
	>(
		(modelValue, parentKey, context) => {
			const key = `${parentKey}_TITLE`;
			const child = field.new(modelValue, key, context);

			return {
				check: () => child.check(),
				reset: () => child.reset(),
				dispose: () => child.dispose(),
				getVNode: () => context.templates.section.getVNode(
					{
						fieldKey: key,
						getCurrentValue: () => modelValue.value,
						title,
					},
					{ formField: () => child.getVNode() },
				),
			};
		},
		field.defaultValue,
	);
}

// Le formulaire instancie le layout avec le modèle initial du champ enfant.
const useForm = createForm(grid.useTemplates());
const { component: ProfileForm, currentValue, check, reset, dispose } = useForm(
	useTitledField(
		useMultiLayout({
			name: useTextInput({ label: "Name" }),
		}),
		"Profile",
	),
);

type _Value = DCommon.ExpectType<
	typeof currentValue.value,
	{ name: string },
	"strict"
>;

// check, reset et dispose sont délégués à l'enfant ; reset du formulaire restaure aussi le modèle initial.
const result = await check();
void result;
void ProfileForm;
reset();
dispose();
